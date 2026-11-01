import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Check, X, Loader2, RefreshCw, Search,
  Eye, FileText, Image as ImageIcon, Calendar, Tag, User, Globe,
  HelpCircle, ArrowLeft, Save, Sparkles, AlertCircle, ExternalLink,
  Wand2, ChevronDown, ChevronUp, Zap, CheckCircle2,
  UploadCloud, MoveUp, MoveDown, Layers, AlignLeft, AlignCenter, AlignRight, Sliders,
  GripVertical, Undo2, Redo2, ListOrdered, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import '../../styles/blog-content.css';

interface BlogMeta {
  authors: { id: number; name: string; role: string; avatar: string }[];
  categories: { id: number; slug: string; name: string }[];
  tags: { id: number; slug: string; name: string }[];
}

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  cover_alt: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  updated_at: string;
  reading_time_min: number;
  view_count: number;
  featured: number;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string };
  _count?: { faqs: number; tags: number };
}

interface FaqFormItem {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
}

export const AdminBlogManager: React.FC = () => {
  // Mode: 'list' | 'create' | 'edit'
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);

  // List State
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Meta Options
  const [meta, setMeta] = useState<BlogMeta>({ authors: [], categories: [], tags: [] });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_html: '',
    category_id: 1,
    author_id: 1,
    cover_image: '/assets/blog/blog-1.webp',
    cover_alt: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    published_at: '',
    featured: 0,
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    og_image: '',
    tag_ids: [] as number[],
    faqs: [] as FaqFormItem[]
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [slugManual, setSlugManual] = useState(false);
  const [editorTab, setEditorTab] = useState<'visual' | 'preview' | 'code'>('visual');
  const [autosaveNotice, setAutosaveNotice] = useState<string>('');
  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Undo / Redo Stack State
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Accessibility Announcements
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');

  // Figure In-Editor Selection & Repositioning State
  const [selectedFigureIdx, setSelectedFigureIdx] = useState<number | null>(null);
  const [selectedFigureEl, setSelectedFigureEl] = useState<HTMLElement | null>(null);
  const [openMoveToDropdown, setOpenMoveToDropdown] = useState<number | null>(null);
  const [showInEditorMoveTo, setShowInEditorMoveTo] = useState(false);

  // Pointer Drag and Drop State
  const [isDraggingFigure, setIsDraggingFigure] = useState(false);
  const [dragGhostPos, setDragGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [dropLineState, setDropLineState] = useState<{ top: number; targetEl: HTMLElement; position: 'before' | 'after' } | null>(null);
  const measuredBlocksRef = useRef<Array<{ element: HTMLElement; top: number; bottom: number; midpoint: number }>>([]);

  // Push state to undo stack
  const pushUndoState = (html: string) => {
    setUndoStack((prev) => [...prev.slice(-30), html]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevHtml = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, formData.content_html]);
    setFormData((prev) => ({ ...prev, content_html: prevHtml }));
    if (visualEditorRef.current && editorTab === 'visual') {
      visualEditorRef.current.innerHTML = prevHtml;
    }
    setAriaAnnouncement('Action undone');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextHtml = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, formData.content_html]);
    setFormData((prev) => ({ ...prev, content_html: nextHtml }));
    if (visualEditorRef.current && editorTab === 'visual') {
      visualEditorRef.current.innerHTML = nextHtml;
    }
    setAriaAnnouncement('Action redone');
  };

  // Synchronize visual editor DOM with formData.content_html
  useEffect(() => {
    if (visualEditorRef.current && editorTab === 'visual') {
      if (visualEditorRef.current.innerHTML !== formData.content_html) {
        visualEditorRef.current.innerHTML = formData.content_html;
      }
    }
  }, [formData.content_html, editorTab]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setFormData((prev) => ({ ...prev, content_html: html }));
    }
  };

  const formatDoc = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    handleVisualInput();
  };

  const insertCallout = () => {
    const calloutHtml = `<div class="my-6 p-5 rounded-2xl bg-orange-50/80 border-l-4 border-orange-500 text-slate-800"><p class="font-bold text-orange-950 mb-1">💡 Key Architectural Insight</p><p>Write your key insight or pro-tip here...</p></div><p></p>`;
    document.execCommand('insertHTML', false, calloutHtml);
    handleVisualInput();
  };

  const insertTable = () => {
    const tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border border-slate-200 text-xs"><thead><tr class="bg-slate-100 text-navy-950 font-bold border-b border-slate-200"><th class="p-3 border-r border-slate-200">Evaluation Dimension</th><th class="p-3 border-r border-slate-200">Standard Approach</th><th class="p-3 bg-orange-50/50 text-orange-950">Enterprise Standard (2026)</th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700"><tr><td class="p-3 font-semibold border-r border-slate-200">Architecture</td><td class="p-3 border-r border-slate-200">Monolithic / Ad-hoc</td><td class="p-3 bg-orange-50/20 font-medium">Modular & Event-Driven</td></tr></tbody></table></div><p></p>`;
    document.execCommand('insertHTML', false, tableHtml);
    handleVisualInput();
  };

  // ──────────────────────────────────────────────────────────────────────────
  // IN-CONTENT IMAGE INSERTION & MEDIA LIBRARY STATE
  // ──────────────────────────────────────────────────────────────────────────
  interface QueuedImage {
    id: string;
    file?: File;
    previewUrl: string;
    alt: string;
    isDecorative: boolean;
    caption: string;
    align: 'left' | 'center' | 'right';
    size: number;
    status: 'pending' | 'uploading' | 'ready' | 'error';
    error?: string;
    progress: number;
    uploadedUrl?: string;
  }

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalTab, setImageModalTab] = useState<'upload' | 'recent'>('upload');
  const [queuedImages, setQueuedImages] = useState<QueuedImage[]>([]);
  const [recentMedia, setRecentMedia] = useState<any[]>([]);
  const [loadingRecentMedia, setLoadingRecentMedia] = useState(false);
  const [selectedRecentItem, setSelectedRecentItem] = useState<any | null>(null);
  const [recentAlt, setRecentAlt] = useState('');
  const [recentIsDecorative, setRecentIsDecorative] = useState(false);
  const [recentCaption, setRecentCaption] = useState('');
  const [recentAlign, setRecentAlign] = useState<'left' | 'center' | 'right'>('center');
  const [recentSize, setRecentSize] = useState<number>(100);
  const [showImagesDrawer, setShowImagesDrawer] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const savedRangeRef = useRef<Range | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Capture selection position before dialog opens
  const handleOpenImageModal = () => {
    if (editorTab === 'visual' && visualEditorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
    setIsImageModalOpen(true);
    fetchRecentMedia();
  };

  const fetchRecentMedia = () => {
    setLoadingRecentMedia(true);
    api
      .get('/admin/blog/media')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setRecentMedia(res.data.data);
          if (res.data.data.length > 0 && !selectedRecentItem) {
            setSelectedRecentItem(res.data.data[0]);
          }
        }
      })
      .catch((err) => console.warn('Could not load recent media:', err))
      .finally(() => setLoadingRecentMedia(false));
  };

  // Add Files to Upload Queue
  const handleAddFilesToQueue = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const newItems: QueuedImage[] = [];

    files.forEach((file) => {
      // Validate SVG rejection
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        alert(`File "${file.name}" rejected: SVG illustrations must be converted to WebP or PNG before uploading to prevent XSS vulnerabilities.`);
        return;
      }

      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id,
        file,
        previewUrl,
        alt: '',
        isDecorative: false,
        caption: '',
        align: 'center',
        size: 100,
        status: 'pending',
        progress: 0
      });
    });

    setQueuedImages((prev) => [...prev, ...newItems]);
  };

  // Paste image from clipboard
  const handlePasteFromClipboard = (e: React.ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      handleAddFilesToQueue(e.clipboardData.files);
    }
  };

  // Block-Level Figure Markup Insertion (never splits sentences or blocks)
  const insertFigureMarkup = (figuresHtml: string) => {
    if (editorTab === 'code') {
      const textarea = document.querySelector('textarea[name="content_html"]') as HTMLTextAreaElement | null;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const newHtml = before + '\n' + figuresHtml + '\n' + after;
        setFormData((prev) => ({ ...prev, content_html: newHtml }));
      } else {
        setFormData((prev) => ({ ...prev, content_html: prev.content_html + '\n' + figuresHtml }));
      }
      return;
    }

    if (editorTab === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      let targetBlock: Node | null = null;

      // Restore saved range if available
      if (savedRangeRef.current && sel) {
        try {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        } catch (_) {}
      }

      if (sel && sel.rangeCount > 0) {
        let node: Node | null = sel.getRangeAt(0).startContainer;
        if (visualEditorRef.current.contains(node)) {
          while (node && node !== visualEditorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tag = (node as Element).tagName.toUpperCase();
              if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'DIV', 'BLOCKQUOTE', 'FIGURE'].includes(tag)) {
                targetBlock = node;
                break;
              }
            }
            node = node.parentNode;
          }
        }
      }

      const temp = document.createElement('div');
      temp.innerHTML = figuresHtml;
      const fragment = document.createDocumentFragment();
      while (temp.firstChild) {
        fragment.appendChild(temp.firstChild);
      }

      if (targetBlock && targetBlock.parentNode && visualEditorRef.current.contains(targetBlock)) {
        // Insert AFTER the entire block
        targetBlock.parentNode.insertBefore(fragment, targetBlock.nextSibling);
      } else {
        visualEditorRef.current.appendChild(fragment);
      }

      const updatedHtml = visualEditorRef.current.innerHTML;
      setFormData((prev) => ({ ...prev, content_html: updatedHtml }));
    }
  };

  // Upload and Insert Queued Images
  const handleUploadAndInsertQueued = async () => {
    // Validate alt text
    const missingAlt = queuedImages.find((q) => !q.isDecorative && !q.alt.trim());
    if (missingAlt) {
      alert('Alt text is required for all informative images to meet accessibility requirements. Check "Decorative image" if this image has no informational value.');
      return;
    }

    setIsUploadingImages(true);

    try {
      const generatedFigures: string[] = [];

      for (const item of queuedImages) {
        if (!item.file) continue;

        const body = new FormData();
        body.append('image', item.file);

        const res = await api.post('/admin/blog/upload-image', body, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.success) {
          const uploaded = res.data.data;
          const imgUrl = uploaded.url || res.data.items?.[0]?.url;
          const altText = item.isDecorative ? '' : item.alt.trim();
          const captionHtml = item.caption.trim()
            ? `<figcaption>${item.caption.trim()}</figcaption>`
            : '';

          const figureMarkup = `<figure class="blog-figure align-${item.align} w-${item.size}" data-align="${item.align}" data-size="${item.size}"><img src="${imgUrl}" alt="${altText}" loading="lazy" decoding="async" />${captionHtml}</figure><p></p>`;
          generatedFigures.push(figureMarkup);
        }
      }

      if (generatedFigures.length > 0) {
        insertFigureMarkup(generatedFigures.join('\n'));
        setIsImageModalOpen(false);
        setQueuedImages([]);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to upload images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Insert Selected Recent Image
  const handleInsertRecentSelected = () => {
    if (!selectedRecentItem) return;
    if (!recentIsDecorative && !recentAlt.trim()) {
      alert('Alt text is required for non-decorative images.');
      return;
    }

    const altText = recentIsDecorative ? '' : recentAlt.trim();
    const captionHtml = recentCaption.trim()
      ? `<figcaption>${recentCaption.trim()}</figcaption>`
      : '';

    const figureMarkup = `<figure class="blog-figure align-${recentAlign} w-${recentSize}" data-align="${recentAlign}" data-size="${recentSize}"><img src="${selectedRecentItem.url}" alt="${altText}" loading="lazy" decoding="async" />${captionHtml}</figure><p></p>`;

    insertFigureMarkup(figureMarkup);
    setIsImageModalOpen(false);
    setSelectedRecentItem(null);
  };

  // Parse all figures currently in article content for the "Images in this post" drawer
  const parseFiguresFromContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.content_html, 'text/html');
    const figures = Array.from(doc.querySelectorAll('figure.blog-figure'));
    return figures.map((fig, idx) => {
      const img = fig.querySelector('img');
      const caption = fig.querySelector('figcaption');

      // Find top-level block
      let topBlock: Element = fig;
      while (topBlock.parentElement && topBlock.parentElement !== doc.body) {
        topBlock = topBlock.parentElement;
      }
      const canMoveUp = !!topBlock.previousElementSibling;
      const canMoveDown = !!topBlock.nextElementSibling;

      return {
        index: idx,
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
        caption: caption?.textContent || '',
        align: fig.getAttribute('data-align') || (fig.classList.contains('align-left') ? 'left' : fig.classList.contains('align-right') ? 'right' : 'center'),
        size: fig.getAttribute('data-size') || '100',
        canMoveUp,
        canMoveDown
      };
    });
  };

  const parsedFigures = parseFiguresFromContent();

  // Extract human-readable block positions from content_html for "Move to..." menus
  const getBlockPositions = (excludeFigIndex?: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.content_html, 'text/html');
    const allFigures = Array.from(doc.querySelectorAll('figure.blog-figure'));
    const targetFig = excludeFigIndex !== undefined ? allFigures[excludeFigIndex] : null;

    let targetBlock: Element | null = null;
    if (targetFig) {
      targetBlock = targetFig;
      while (targetBlock.parentElement && targetBlock.parentElement !== doc.body) {
        targetBlock = targetBlock.parentElement;
      }
    }

    const blocks = Array.from(doc.body.children).filter((b) => b !== targetBlock);
    const positions: { index: number; label: string }[] = [
      { index: 0, label: '⬆ At the very top (before all content)' }
    ];

    blocks.forEach((block, idx) => {
      let tag = block.tagName.toLowerCase();
      let text = block.textContent?.trim() || '';
      if (text.length > 36) text = text.slice(0, 36) + '...';

      let typeDesc = 'Block';
      if (tag.startsWith('h')) typeDesc = `Heading ${tag.toUpperCase()}`;
      else if (tag === 'p') typeDesc = 'Paragraph';
      else if (tag === 'ul' || tag === 'ol') typeDesc = 'List';
      else if (tag === 'table' || block.querySelector('table')) typeDesc = 'Table';
      else if (block.classList.contains('blog-callout') || block.classList.contains('bg-orange-50/80')) typeDesc = 'Callout Box';
      else if (tag === 'figure' || block.classList.contains('blog-figure')) typeDesc = 'Another Image';

      const label = text ? `After: ${text} (${typeDesc})` : `After: ${typeDesc} #${idx + 1}`;
      positions.push({
        index: idx + 1,
        label
      });
    });

    return positions;
  };

  // Reorder, Move, or Delete Figure in Content
  const handleModifyFigureInContent = (
    index: number,
    action: 'up' | 'down' | 'top' | 'bottom' | 'delete' | 'align' | 'size' | 'moveTo',
    value?: string | number
  ) => {
    pushUndoState(formData.content_html);

    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.content_html, 'text/html');
    const figures = Array.from(doc.querySelectorAll('figure.blog-figure'));
    const target = figures[index];
    if (!target) return;

    let targetBlock: Element = target;
    while (targetBlock.parentElement && targetBlock.parentElement !== doc.body) {
      targetBlock = targetBlock.parentElement;
    }

    let announcement = '';

    if (action === 'delete') {
      targetBlock.remove();
      announcement = 'Image removed from article';
      setSelectedFigureIdx(null);
      setSelectedFigureEl(null);
    } else if (action === 'up' && targetBlock.previousElementSibling) {
      const prevBlock = targetBlock.previousElementSibling;
      targetBlock.parentElement?.insertBefore(targetBlock, prevBlock);
      const textPreview = prevBlock.textContent?.trim().slice(0, 30) || 'previous block';
      announcement = `Image moved before "${textPreview}"`;
    } else if (action === 'down' && targetBlock.nextElementSibling) {
      const nextBlock = targetBlock.nextElementSibling;
      targetBlock.parentElement?.insertBefore(targetBlock, nextBlock.nextElementSibling);
      const textPreview = nextBlock.textContent?.trim().slice(0, 30) || 'next block';
      announcement = `Image moved after "${textPreview}"`;
    } else if (action === 'top') {
      const first = doc.body.firstElementChild;
      if (first && first !== targetBlock) {
        doc.body.insertBefore(targetBlock, first);
        announcement = 'Image moved to top of article';
      }
    } else if (action === 'bottom') {
      doc.body.appendChild(targetBlock);
      announcement = 'Image moved to bottom of article';
    } else if (action === 'moveTo' && typeof value === 'number') {
      const otherBlocks = Array.from(doc.body.children).filter((b) => b !== targetBlock);
      if (value === 0) {
        doc.body.insertBefore(targetBlock, doc.body.firstElementChild);
      } else if (value >= otherBlocks.length) {
        doc.body.appendChild(targetBlock);
      } else {
        doc.body.insertBefore(targetBlock, otherBlocks[value]);
      }
      announcement = `Image moved to position ${value + 1}`;
    } else if (action === 'align' && typeof value === 'string') {
      target.classList.remove('align-left', 'align-center', 'align-right');
      target.classList.add(`align-${value}`);
      target.setAttribute('data-align', value);
    } else if (action === 'size' && typeof value === 'string') {
      target.classList.remove('w-25', 'w-33', 'w-50', 'w-66', 'w-75', 'w-100');
      target.classList.add(`w-${value}`);
      target.setAttribute('data-size', value);
    }

    const updatedHtml = doc.body.innerHTML;
    setFormData((prev) => ({ ...prev, content_html: updatedHtml }));

    // Keep visual editor in sync immediately
    if (visualEditorRef.current && editorTab === 'visual') {
      visualEditorRef.current.innerHTML = updatedHtml;
      setTimeout(() => {
        const domFigures = visualEditorRef.current?.querySelectorAll('figure.blog-figure');
        const targetSrc = target.querySelector('img')?.getAttribute('src');
        if (domFigures && targetSrc) {
          Array.from(domFigures).forEach((df, i) => {
            if (df.querySelector('img')?.getAttribute('src') === targetSrc) {
              const el = df as HTMLElement;
              el.classList.add('figure-highlight-pulse');
              el.classList.add('is-selected');
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              setTimeout(() => el.classList.remove('figure-highlight-pulse'), 1400);
              setSelectedFigureIdx(i);
              setSelectedFigureEl(el);
            }
          });
        }
      }, 50);
    }

    if (announcement) {
      setAriaAnnouncement(announcement);
    }
  };

  const handleScrollToFigure = (index: number) => {
    if (editorTab !== 'visual') {
      setEditorTab('visual');
    }
    setTimeout(() => {
      if (visualEditorRef.current) {
        const figures = visualEditorRef.current.querySelectorAll('figure.blog-figure');
        if (figures[index]) {
          const el = figures[index] as HTMLElement;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('figure-highlight-pulse');
          el.classList.add('is-selected');
          setSelectedFigureIdx(index);
          setSelectedFigureEl(el);
          setTimeout(() => el.classList.remove('figure-highlight-pulse'), 1500);
        }
      }
    }, 80);
  };

  // Drag and drop handlers for repositioning in visual editor
  const handleStartDrag = (e: React.PointerEvent) => {
    if (!visualEditorRef.current || selectedFigureIdx === null) return;
    const figures = Array.from(visualEditorRef.current.querySelectorAll('figure.blog-figure'));
    const targetFig = figures[selectedFigureIdx] as HTMLElement;
    if (!targetFig) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const blocks = Array.from(visualEditorRef.current.children).filter(
      (el) => el.nodeType === Node.ELEMENT_NODE && !el.classList.contains('figure-control-bar')
    );

    measuredBlocksRef.current = blocks.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        element: el as HTMLElement,
        top: r.top,
        bottom: r.bottom,
        midpoint: r.top + r.height / 2
      };
    });

    setIsDraggingFigure(true);
    targetFig.classList.add('is-dragging');
    setDragGhostPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingFigure || !visualEditorRef.current) return;
    setDragGhostPos({ x: e.clientX, y: e.clientY });

    // Auto-scroll window if near edges
    if (e.clientY < 70) {
      window.scrollBy({ top: -Math.min(25, (70 - e.clientY) * 0.6), behavior: 'auto' });
    } else if (e.clientY > window.innerHeight - 70) {
      window.scrollBy({ top: Math.min(25, (e.clientY - (window.innerHeight - 70)) * 0.6), behavior: 'auto' });
    }

    const editorRect = visualEditorRef.current.getBoundingClientRect();
    const blocks = measuredBlocksRef.current;
    if (blocks.length === 0) return;

    let target: { element: HTMLElement; position: 'before' | 'after' } | null = null;
    let lineTop = 0;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.element === selectedFigureEl) continue;

      if (e.clientY < b.midpoint) {
        target = { element: b.element, position: 'before' };
        lineTop = b.top - editorRect.top + visualEditorRef.current.scrollTop - 2;
        break;
      } else if (e.clientY >= b.midpoint && e.clientY <= b.bottom + 10) {
        target = { element: b.element, position: 'after' };
        lineTop = b.bottom - editorRect.top + visualEditorRef.current.scrollTop + 2;
      }
    }

    if (!target && blocks.length > 0) {
      const last = blocks[blocks.length - 1];
      if (e.clientY > last.bottom) {
        target = { element: last.element, position: 'after' };
        lineTop = last.bottom - editorRect.top + visualEditorRef.current.scrollTop + 2;
      }
    }

    if (target) {
      setDropLineState({ top: lineTop, targetEl: target.element, position: target.position });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingFigure) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    setIsDraggingFigure(false);
    setDragGhostPos(null);

    if (selectedFigureEl) {
      selectedFigureEl.classList.remove('is-dragging');
    }

    if (dropLineState && selectedFigureEl && visualEditorRef.current) {
      pushUndoState(formData.content_html);

      if (dropLineState.position === 'before') {
        dropLineState.targetEl.parentElement?.insertBefore(selectedFigureEl, dropLineState.targetEl);
      } else {
        dropLineState.targetEl.parentElement?.insertBefore(selectedFigureEl, dropLineState.targetEl.nextElementSibling);
      }

      const newHtml = visualEditorRef.current.innerHTML;
      setFormData((prev) => ({ ...prev, content_html: newHtml }));
      setAriaAnnouncement('Image dropped at new position');

      selectedFigureEl.classList.add('figure-highlight-pulse');
      setTimeout(() => selectedFigureEl?.classList.remove('figure-highlight-pulse'), 1400);

      const figures = Array.from(visualEditorRef.current.querySelectorAll('figure.blog-figure'));
      const newIdx = figures.indexOf(selectedFigureEl);
      if (newIdx !== -1) setSelectedFigureIdx(newIdx);
    }

    setDropLineState(null);
  };

  // Keyboard shortcut listener for Alt+Arrow keys and Undo/Redo
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === 'z' || e.key === 'Z') {
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
          return;
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Figure repositioning with Alt+Arrows
      if (selectedFigureIdx !== null && e.altKey) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (e.shiftKey) {
            handleModifyFigureInContent(selectedFigureIdx, 'top');
          } else {
            handleModifyFigureInContent(selectedFigureIdx, 'up');
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (e.shiftKey) {
            handleModifyFigureInContent(selectedFigureIdx, 'bottom');
          } else {
            handleModifyFigureInContent(selectedFigureIdx, 'down');
          }
        }
      } else if (e.key === 'Escape') {
        setSelectedFigureIdx(null);
        setSelectedFigureEl(null);
        setIsDraggingFigure(false);
        setDropLineState(null);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedFigureIdx, formData.content_html, undoStack, redoStack]);

  // Handle click inside visual editor to select / deselect figures
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const figure = target.closest('figure.blog-figure') as HTMLElement | null;
    if (figure && visualEditorRef.current) {
      const figures = Array.from(visualEditorRef.current.querySelectorAll('figure.blog-figure'));
      const idx = figures.indexOf(figure);
      if (idx !== -1) {
        setSelectedFigureIdx(idx);
        setSelectedFigureEl(figure);
        figures.forEach((f, i) => {
          if (i === idx) f.classList.add('is-selected');
          else f.classList.remove('is-selected');
        });
        return;
      }
    }
    // Clicking outside any figure deselects
    if (!target.closest('.figure-control-bar') && !target.closest('.popover-menu')) {
      setSelectedFigureIdx(null);
      setSelectedFigureEl(null);
      visualEditorRef.current?.querySelectorAll('figure.blog-figure').forEach((f) => {
        f.classList.remove('is-selected');
      });
    }
  };

  // AI Article Generator State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Technical Deep-Dive');
  const [aiAudience, setAiAudience] = useState('Software Engineers & Tech Leads');
  const [aiAutoFillMeta, setAiAutoFillMeta] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = [
    'How Engineers Beat Enterprise ATS Resume Parsers in 2026',
    'Event-Driven Microservices with Kafka & AWS Architecture',
    'Senior Java & Spring Boot Distributed Systems Interview Guide',
    'Snowflake, Apache Spark & Modern Data Engineering Best Practices',
    'Direct C2C vs W-2 IT Contracting & Rate Negotiation Blueprint',
    'Kubernetes GitOps, ArgoCD & Zero-Downtime Deployment Strategy',
  ];

  const handleGenerateAIArticle = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a topic, prompt, or a few bullet points describing the article.');
      aiInputRef.current?.focus();
      return;
    }

    setAiGenerating(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const res = await api.post('/admin/blog/ai-generate', {
        prompt: aiPrompt.trim(),
        tone: aiTone,
        audience: aiAudience,
        generateFaqs: aiAutoFillMeta,
      });

      if (res.data?.success && res.data?.data) {
        const article = res.data.data;

        setFormData((prev) => {
          const updated: any = {
            ...prev,
            content_html: article.content_html,
          };

          if (aiAutoFillMeta) {
            if (!prev.title || prev.title.trim().length === 0 || prev.title === 'Untitled Article') {
              updated.title = article.title;
              if (mode === 'create' && !slugManual) {
                updated.slug = article.slug;
              }
            } else if (!updated.slug && mode === 'create') {
              updated.slug = article.slug;
            }

            if (!prev.excerpt || prev.excerpt.trim().length === 0) {
              updated.excerpt = article.excerpt;
            }

            if (!prev.seo_title || prev.seo_title.trim().length === 0) {
              updated.seo_title = article.seo_title;
            }

            if (!prev.seo_description || prev.seo_description.trim().length === 0) {
              updated.seo_description = article.seo_description;
            }

            if ((!prev.faqs || prev.faqs.length === 0 || (prev.faqs.length <= 2 && !prev.faqs[0].question)) && article.faqs?.length) {
              updated.faqs = article.faqs;
            }
          }

          return updated;
        });

        // Switch tab to visual so the admin immediately sees the ready-made formatted article without HTML tags
        setEditorTab('visual');

        setAiSuccessMessage(
          `✨ Article generated successfully! (${article.word_count || 1400} words, ~${article.reading_time_min || 7} min read). Formatted with SEO headings, bullet points, callouts, and conclusions.`
        );

        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.content_html;
          delete next.title;
          delete next.excerpt;
          return next;
        });
      } else {
        throw new Error(res.data?.error || 'Failed to generate article.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with AI generator service. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Fetch Metadata
  const fetchMeta = () => {
    api.get('/admin/blog/meta')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setMeta(res.data.data);
          if (res.data.data.categories?.[0] && formData.category_id === 1) {
            setFormData((prev) => ({
              ...prev,
              category_id: res.data.data.categories[0].id,
              author_id: res.data.data.authors[0]?.id || 1
            }));
          }
        }
      })
      .catch((err) => console.warn('Could not load blog meta:', err));
  };

  // Fetch List of Posts
  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '10');
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    api.get(`/admin/blog/posts?${params.toString()}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPosts(res.data.data.items);
          setTotalCount(res.data.data.total);
          setTotalPages(res.data.data.totalPages);
        }
      })
      .catch((err) => console.error('Failed to load admin blog posts:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (mode === 'list') {
      fetchPosts();
    }
  }, [mode, currentPage, statusFilter, searchQuery]);

  // Real-time slug auto-generation from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const updated: any = { ...prev, title: titleVal };
      if (!slugManual && mode === 'create') {
        updated.slug = titleVal
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  // Autosave to localStorage on debounced interval
  useEffect(() => {
    if (mode === 'list' || !formData.title) return;
    const key = `codex_admin_draft_${editingId || 'new'}`;
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(formData));
      setAutosaveNotice(`Autosaved at ${new Date().toLocaleTimeString()}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, mode, editingId]);

  // Open Create Mode
  const handleStartCreate = () => {
    setEditingId(null);
    setSlugManual(false);
    setFormErrors({});
    setAiPrompt('');
    setAiError(null);
    setAiSuccessMessage(null);
    setShowAiPanel(true);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content_html: `<h2>Overview of the Topic</h2>\n<p>Write your detailed technical guidance here...</p>\n\n<h2>Key Architectural Pillars</h2>\n<ul class="list-disc pl-6 space-y-2">\n  <li>First major takeaway</li>\n  <li>Second major takeaway</li>\n</ul>`,
      category_id: meta.categories[0]?.id || 1,
      author_id: meta.authors[0]?.id || 1,
      cover_image: '/assets/blog/blog-1.webp',
      cover_alt: 'Technical analysis diagram',
      status: 'draft',
      published_at: '',
      featured: 0,
      seo_title: '',
      seo_description: '',
      canonical_url: '',
      og_image: '',
      tag_ids: meta.tags[0] ? [meta.tags[0].id] : [],
      faqs: [
        { question: 'What is the primary takeaway of this guide?', answer: 'Detailed actionable answer for candidates.', sort_order: 1 },
        { question: 'How can engineers apply this immediately?', answer: 'Step by step implementation advice.', sort_order: 2 }
      ]
    });
    setEditorTab('visual');
    setMode('create');
  };

  // Open Edit Mode
  const handleStartEdit = async (id: number) => {
    setEditingId(id);
    setSlugManual(true);
    setFormErrors({});
    setAiPrompt('');
    setAiError(null);
    setAiSuccessMessage(null);
    setEditorTab('visual');
    setLoading(true);

    try {
      const res = await api.get(`/admin/blog/posts/${id}`);
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        setFormData({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content_html: p.content_html,
          category_id: p.category_id,
          author_id: p.author_id,
          cover_image: p.cover_image,
          cover_alt: p.cover_alt,
          status: p.status,
          published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : '',
          featured: p.featured || 0,
          seo_title: p.seo_title || '',
          seo_description: p.seo_description || '',
          canonical_url: p.canonical_url || '',
          og_image: p.og_image || '',
          tag_ids: p.tag_ids || (p.tags ? p.tags.map((t: any) => t.tag_id || t.id) : []),
          faqs: (p.faqs || []).map((f: any, idx: number) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            sort_order: f.sort_order || idx + 1
          }))
        });
        setMode('edit');
      }
    } catch (err) {
      alert('Failed to load post for editing.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Post with confirmation
  const handleDeletePost = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/blog/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      alert('Failed to delete article.');
    }
  };

  // Quick Status Toggle (Draft <-> Published)
  const handleToggleStatus = async (post: BlogPostRow) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/admin/blog/posts/${post.id}/status`, { status: nextStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Handle Cover Image Upload with WebP conversion
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be under 5MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/admin/blog/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          cover_image: res.data.data.url
        }));
      }
    } catch (err) {
      alert('Image upload and WebP conversion failed. Please check image format.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Tag Selection Toggle
  const toggleTagSelection = (tagId: number) => {
    setFormData((prev) => {
      const exists = prev.tag_ids.includes(tagId);
      return {
        ...prev,
        tag_ids: exists ? prev.tag_ids.filter((id) => id !== tagId) : [...prev.tag_ids, tagId]
      };
    });
  };

  // FAQ Management in Form
  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: '', answer: '', sort_order: prev.faqs.length + 1 }
      ]
    }));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const nextFaqs = [...prev.faqs];
      nextFaqs[index] = { ...nextFaqs[index], [field]: value };
      return { ...prev, faqs: nextFaqs };
    });
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (targetStatus?: 'draft' | 'published') => {
    setFormErrors({});
    const liveContentHtml = editorTab === 'visual' && visualEditorRef.current
      ? visualEditorRef.current.innerHTML
      : formData.content_html;

    const submitPayload = {
      ...formData,
      content_html: liveContentHtml,
      status: targetStatus || formData.status,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null
    };

    // Validation
    const errors: Record<string, string> = {};
    if (!submitPayload.title.trim()) errors.title = 'Title is required';
    if (!submitPayload.slug.trim()) errors.slug = 'Slug is required';
    if (!submitPayload.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (!submitPayload.content_html.trim()) errors.content_html = 'Article content is required';
    if (!submitPayload.cover_image.trim()) errors.cover_image = 'Cover image is required';
    if (!submitPayload.cover_alt.trim()) errors.cover_alt = 'Cover alt text is required for accessibility';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitting(true);
    try {
      if (mode === 'create') {
        const res = await api.post('/admin/blog/posts', submitPayload);
        if (res.data?.success) {
          localStorage.removeItem(`codex_admin_draft_new`);
          setMode('list');
          fetchPosts();
        }
      } else if (mode === 'edit' && editingId) {
        const res = await api.put(`/admin/blog/posts/${editingId}`, submitPayload);
        if (res.data?.success) {
          localStorage.removeItem(`codex_admin_draft_${editingId}`);
          setMode('list');
          fetchPosts();
        }
      }
    } catch (err: any) {
      if (err.response?.data?.error?.slug) {
        setFormErrors({ slug: 'This URL slug is already taken by another article.' });
      } else {
        alert(err.response?.data?.error?.message || 'Failed to save article.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Estimated reading time
  const estimatedReadTime = Math.max(
    3,
    Math.ceil(formData.content_html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length / 200)
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: LIST OF POSTS
  // ──────────────────────────────────────────────────────────────────────────
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header & New Article CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 flex items-center gap-2">
              <span>Blog Manager</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
                {totalCount} Articles
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Author, publish, schedule and edit Codex Tech-IT technical career insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={handleStartCreate} className="gap-1.5">
              <Plus className="w-4 h-4" /> New Article
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'published', 'draft', 'scheduled'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Articles */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading articles from MySQL...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-600 mb-2">No articles match your filter criteria.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-navy-900 font-heading font-bold">
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-16 h-9 object-cover rounded-lg bg-slate-100 shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <span className="font-heading font-bold text-navy-900 block truncate hover:text-orange-500 cursor-pointer" onClick={() => handleStartEdit(post.id)}>
                              {post.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block truncate">
                              /blog/{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {post.category?.name}
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {post.author?.name}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          title="Click to toggle status"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : post.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                        {post.view_count.toLocaleString()}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleStartEdit(post.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: CREATE / EDIT ARTICLE FORM
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('list')}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 text-navy-900 transition-colors cursor-pointer"
            title="Back to articles list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-navy-900">
              {mode === 'create' ? 'Create New Article' : `Edit: ${formData.title || 'Untitled Article'}`}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>Reading time: ~{estimatedReadTime} min</span>
              {autosaveNotice && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{autosaveNotice}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={formSubmitting}
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={formSubmitting}
            onClick={() => handleSubmit('published')}
            className="gap-1.5"
          >
            {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publish Article</span>
          </Button>
        </div>
      </div>

      {/* Editor Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editor Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-heading font-bold text-navy-900">Article Title *</label>
                <span className={formData.title.length > 70 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                  {formData.title.length}/70 chars
                </span>
              </div>
              <input
                type="text"
                id="blog-form-title"
                name="title"
                data-testid="blog-form-title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter article title (e.g. The 2026 Engineer's Guide to Beating ATS Resumes)..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {formErrors.title && <p className="text-[11px] text-red-600 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-heading font-bold text-navy-900" htmlFor="blog-form-slug">URL Slug *</label>
                <button
                  type="button"
                  onClick={() => setSlugManual(!slugManual)}
                  className="text-[11px] text-orange-600 font-semibold hover:underline cursor-pointer"
                >
                  {slugManual ? 'Enable Auto-Slug' : 'Edit Manually'}
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-slate-500 font-mono">
                  /blog/
                </span>
                <input
                  type="text"
                  id="blog-form-slug"
                  name="slug"
                  data-testid="blog-form-slug"
                  disabled={!slugManual && mode === 'create'}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                  placeholder="ats-resume-optimization-guide-2026"
                  className="flex-1 px-3 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-slate-50"
                />
              </div>
              {formErrors.slug && <p className="text-[11px] text-red-600 mt-1">{formErrors.slug}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-heading font-bold text-navy-900">Summary / Excerpt *</label>
                <span className={formData.excerpt.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                  {formData.excerpt.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="High-level 2-3 sentence overview of this intelligence report..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {formErrors.excerpt && <p className="text-[11px] text-red-600 mt-1">{formErrors.excerpt}</p>}
            </div>
          </div>

          {/* AI Article Generator Panel */}
          <div className="bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-white p-6 rounded-2xl border-2 border-orange-200/80 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/10 to-amber-300/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-navy-900 text-sm">
                      AI Blog Content Generator
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
                      Ready-Made Content
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Throw in a prompt, topic, or rough bullet points. AI automatically generates and directly inserts complete ready-made content with headings, bullet points, callouts &amp; conclusion—no HTML code required!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg hover:bg-orange-100/50 transition-colors cursor-pointer"
                title={showAiPanel ? 'Minimize AI Panel' : 'Expand AI Panel'}
              >
                {showAiPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showAiPanel && (
              <div className="space-y-4 pt-2 relative z-10">
                {/* Prompt Input */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5 flex items-center justify-between">
                    <span>Topic, Article Prompt, or Core Idea *</span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. AWS, Kafka, Microservices, ATS Resumes, Salary Strategy</span>
                  </label>
                  <textarea
                    ref={aiInputRef}
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Write a comprehensive guide for senior backend engineers on designing distributed event meshes with Apache Kafka and AWS in 2026, including latency benchmarks, failure modes, and interview questions..."
                    className="w-full px-4 py-3 rounded-xl border border-orange-200/90 text-xs text-navy-900 bg-white/95 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-slate-400 shadow-2xs"
                  />
                </div>

                {/* Quick Topic Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    💡 Or pick an instant technical topic:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAiPrompt(p)}
                        className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/80 text-[11px] text-slate-600 hover:text-orange-950 transition-all cursor-pointer shadow-2xs"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone, Audience & Metadata Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-navy-900 block mb-1">Article Tone &amp; Style</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                    >
                      <option value="Technical Deep-Dive">🎯 Technical Deep-Dive</option>
                      <option value="Career & Salary Strategy">💼 Career &amp; Compensation Strategy</option>
                      <option value="Executive & Staffing Leadership">👔 Staffing &amp; Hiring Leadership</option>
                      <option value="Interview Preparation & STAR Defense">🚀 Interview Preparation &amp; Mock Prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-navy-900 block mb-1">Target Audience</label>
                    <select
                      value={aiAudience}
                      onChange={(e) => setAiAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                    >
                      <option value="Software Engineers & Tech Leads">Senior Software &amp; Cloud Engineers</option>
                      <option value="Data Engineers & Architects">Data Engineers &amp; Snowflake Specialists</option>
                      <option value="F1/OPT Graduates & Career Changers">STEM Graduates &amp; Job Seekers</option>
                      <option value="Engineering Managers & CTOs">Engineering Managers &amp; Enterprise CTOs</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-gray-200 cursor-pointer hover:bg-white text-xs font-semibold text-navy-900">
                      <input
                        type="checkbox"
                        checked={aiAutoFillMeta}
                        onChange={(e) => setAiAutoFillMeta(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                      />
                      <span>Auto-fill Title, Summary &amp; FAQs</span>
                    </label>
                  </div>
                </div>

                {/* Notifications */}
                {aiError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{aiError}</span>
                  </div>
                )}

                {aiSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{aiSuccessMessage}</span>
                  </div>
                )}

                {/* Action Trigger */}
                <div className="flex items-center justify-between pt-2 border-t border-orange-100">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generates complete, SEO-friendly HTML with zero manual formatting needed.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAIArticle}
                    disabled={aiGenerating}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Full Article with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate &amp; Insert Article</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* HTML / Markdown Content Editor with Live Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <label className="font-heading font-bold text-navy-900 text-xs">
                  Article Body Content (HTML / Markdown) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowAiPanel(true);
                    aiInputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Open AI Article Generator"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>AI Generate</span>
                </button>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEditorTab('visual')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    editorTab === 'visual' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span>Visual (Ready-Made)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    editorTab === 'preview' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <span>Full Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    editorTab === 'code' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <span>HTML Code</span>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            {editorTab === 'visual' ? (
              <div className="space-y-3">
                {/* Visual Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-gray-200 text-xs">
                  {/* Undo & Redo Controls */}
                  <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs mr-1">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={undoStack.length === 0}
                      className="p-1 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                      className="p-1 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Format:</span>
                  <button
                    type="button"
                    onClick={() => formatDoc('formatBlock', '<h2>')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-navy-900 font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-2xs"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => formatDoc('formatBlock', '<h3>')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-navy-900 font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-2xs"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => formatDoc('formatBlock', '<p>')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-slate-700 hover:bg-orange-50 transition-colors shadow-2xs"
                    title="Paragraph"
                  >
                    ¶ Text
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => formatDoc('bold')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-navy-900 font-black hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-2xs"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => formatDoc('italic')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-navy-900 italic font-serif hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-2xs"
                    title="Italic"
                  >
                    I
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => formatDoc('insertUnorderedList')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-slate-700 hover:bg-orange-50 transition-colors shadow-2xs"
                    title="Bullet List"
                  >
                    • Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => formatDoc('insertOrderedList')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-slate-700 hover:bg-orange-50 transition-colors shadow-2xs"
                    title="Numbered List"
                  >
                    1. Number List
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={insertCallout}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-semibold hover:bg-orange-100 transition-colors shadow-2xs flex items-center gap-1"
                    title="Insert Key Architectural Callout"
                  >
                    <span>💡 Callout Box</span>
                  </button>
                  <button
                    type="button"
                    onClick={insertTable}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-semibold hover:bg-slate-200 transition-colors shadow-2xs flex items-center gap-1"
                    title="Insert Comparison Table"
                  >
                    <span>📊 Table</span>
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={handleOpenImageModal}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    title="Insert image anywhere in article body (Upload multiple or pick from Recent)"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImagesDrawer(!showImagesDrawer)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                      showImagesDrawer
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Manage, reorder, align, and resize all images in this article"
                  >
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>Images ({parsedFigures.length})</span>
                  </button>
                </div>

                {/* "Images in this post" Drawer/Panel */}
                {showImagesDrawer && (
                  <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-600" />
                        <h4 className="font-heading font-bold text-xs text-navy-900">
                          Images in This Post ({parsedFigures.length})
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowImagesDrawer(false)}
                        className="text-slate-400 hover:text-navy-900 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {parsedFigures.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No images inserted yet. Click "Image" in the toolbar above to place figures between paragraphs.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {parsedFigures.map((fig) => (
                          <div
                            key={fig.index}
                            className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-2 text-xs"
                          >
                            <div className="relative group aspect-video overflow-hidden rounded-lg bg-slate-100">
                              <img src={fig.src} alt={fig.alt} className="w-full h-full object-cover" />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy-900/80 text-white">
                                #{fig.index + 1}
                              </span>
                            </div>

                            <p className="text-[11px] font-medium text-slate-700 line-clamp-1" title={fig.alt}>
                              Alt: {fig.alt || <span className="text-slate-400 italic">Decorative</span>}
                            </p>

                            {/* Alignment & Width Presets */}
                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-gray-100">
                              {/* Alignment Buttons */}
                              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'align', 'left')}
                                  className={`p-1 rounded ${fig.align === 'left' ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'}`}
                                  title="Align Left (Float left with text wrapping)"
                                >
                                  <AlignLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'align', 'center')}
                                  className={`p-1 rounded ${fig.align === 'center' ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'}`}
                                  title="Align Center (Full width block)"
                                >
                                  <AlignCenter className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'align', 'right')}
                                  className={`p-1 rounded ${fig.align === 'right' ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'}`}
                                  title="Align Right (Float right with text wrapping)"
                                >
                                  <AlignRight className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Size Selector */}
                              <select
                                value={fig.size}
                                onChange={(e) => handleModifyFigureInContent(fig.index, 'size', e.target.value)}
                                className="px-1.5 py-1 rounded bg-slate-100 text-[11px] font-semibold border-none text-slate-700"
                              >
                                <option value="25">25%</option>
                                <option value="33">33%</option>
                                <option value="50">50%</option>
                                <option value="66">66%</option>
                                <option value="75">75%</option>
                                <option value="100">100%</option>
                              </select>

                              {/* Reorder, Locate, Move To, and Delete */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleScrollToFigure(fig.index)}
                                  className="p-1 rounded text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Locate & Select Image in Visual Editor"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'up')}
                                  disabled={!fig.canMoveUp}
                                  className="p-1 rounded text-slate-600 hover:text-navy-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  title={fig.canMoveUp ? "Move Image Up (past previous block)" : "Already at top of article"}
                                >
                                  <MoveUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'down')}
                                  disabled={!fig.canMoveDown}
                                  className="p-1 rounded text-slate-600 hover:text-navy-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  title={fig.canMoveDown ? "Move Image Down (past next block)" : "Already at bottom of article"}
                                >
                                  <MoveDown className="w-3.5 h-3.5" />
                                </button>

                                {/* Move to... popover */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setOpenMoveToDropdown(openMoveToDropdown === fig.index ? null : fig.index)}
                                    className="p-1 rounded text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                                    title="Move to specific section..."
                                  >
                                    <ListOrdered className="w-3.5 h-3.5" />
                                  </button>
                                  {openMoveToDropdown === fig.index && (
                                    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-1.5 text-xs max-h-56 overflow-y-auto popover-menu">
                                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 mb-1">
                                        Move Image To:
                                      </div>
                                      {getBlockPositions(fig.index).map((pos) => (
                                        <button
                                          key={pos.index}
                                          type="button"
                                          onClick={() => {
                                            handleModifyFigureInContent(fig.index, 'moveTo', pos.index);
                                            setOpenMoveToDropdown(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-orange-50 hover:text-orange-950 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer truncate"
                                        >
                                          {pos.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleModifyFigureInContent(fig.index, 'delete')}
                                  className="p-1 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Editor Wrapper with Floating Image Control Bar, Drop Line & Ghost */}
                <div
                  className="relative space-y-3"
                  onClick={handleEditorClick}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  {/* Floating Image Control Bar when an image is selected */}
                  {selectedFigureIdx !== null && parsedFigures[selectedFigureIdx] && (
                    <div className="figure-control-bar p-2.5 rounded-2xl bg-orange-50/90 backdrop-blur-xs border-2 border-orange-400 shadow-md flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2">
                        {/* Drag Handle */}
                        <div
                          onPointerDown={handleStartDrag}
                          className="px-2.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none shadow-2xs touch-none"
                          title="Drag to reposition this image anywhere between blocks"
                          role="button"
                          aria-label="Drag to move image"
                        >
                          <GripVertical className="w-4 h-4" />
                          <span className="text-xs">Drag to Move</span>
                        </div>

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'up')}
                          disabled={!parsedFigures[selectedFigureIdx].canMoveUp}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title="Move past previous block (Alt+↑)"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-orange-600" />
                          <span>Move Up</span>
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'down')}
                          disabled={!parsedFigures[selectedFigureIdx].canMoveDown}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title="Move past next block (Alt+↓)"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-orange-600" />
                          <span>Move Down</span>
                        </button>

                        {/* In-Editor Move to... */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowInEditorMoveTo(!showInEditorMoveTo)}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title="Move to section..."
                          >
                            <ListOrdered className="w-3.5 h-3.5 text-orange-600" />
                            <span>Move to...</span>
                          </button>
                          {showInEditorMoveTo && (
                            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-2 text-xs max-h-64 overflow-y-auto popover-menu">
                              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 mb-1">
                                Move Image To:
                              </div>
                              {getBlockPositions(selectedFigureIdx).map((pos) => (
                                <button
                                  key={pos.index}
                                  type="button"
                                  onClick={() => {
                                    handleModifyFigureInContent(selectedFigureIdx, 'moveTo', pos.index);
                                    setShowInEditorMoveTo(false);
                                  }}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-orange-50 hover:text-orange-950 text-slate-700 text-xs font-medium transition-colors cursor-pointer truncate"
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Align & Size & Remove & Close */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'align', 'left')}
                            className={`p-1.5 rounded-lg ${parsedFigures[selectedFigureIdx].align === 'left' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-navy-900'}`}
                            title="Float Left (text wraps right)"
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'align', 'center')}
                            className={`p-1.5 rounded-lg ${parsedFigures[selectedFigureIdx].align === 'center' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-navy-900'}`}
                            title="Align Center (centered block)"
                          >
                            <AlignCenter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'align', 'right')}
                            className={`p-1.5 rounded-lg ${parsedFigures[selectedFigureIdx].align === 'right' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-navy-900'}`}
                            title="Float Right (text wraps left)"
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <select
                          value={parsedFigures[selectedFigureIdx].size}
                          onChange={(e) => handleModifyFigureInContent(selectedFigureIdx, 'size', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-slate-700 shadow-2xs"
                        >
                          <option value="25">25%</option>
                          <option value="33">33%</option>
                          <option value="50">50%</option>
                          <option value="66">66%</option>
                          <option value="75">75%</option>
                          <option value="100">100%</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleModifyFigureInContent(selectedFigureIdx, 'delete')}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedFigureIdx(null)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-navy-900"
                          title="Deselect"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Drop line indicator during drag */}
                  {isDraggingFigure && dropLineState && (
                    <div
                      className="editor-drop-line"
                      style={{ top: `${dropLineState.top}px` }}
                    />
                  )}

                  {/* Visual contentEditable Container - Displays actual formatted text without raw HTML tags */}
                  <div
                    ref={visualEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleVisualInput}
                    onBlur={handleVisualInput}
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed min-h-[440px] p-6 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-inner"
                    style={{ outline: 'none' }}
                  />

                  {/* Drag Ghost Thumbnail */}
                  {isDraggingFigure && dragGhostPos && selectedFigureIdx !== null && parsedFigures[selectedFigureIdx] && (
                    <div
                      className="fixed pointer-events-none z-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500 bg-white/95 backdrop-blur-xs p-1.5 transform-gpu"
                      style={{
                        left: `${dragGhostPos.x + 14}px`,
                        top: `${dragGhostPos.y + 14}px`,
                        width: '130px'
                      }}
                    >
                      <img
                        src={parsedFigures[selectedFigureIdx].src}
                        alt="Moving figure"
                        className="w-full h-16 object-cover rounded-xl"
                      />
                      <div className="text-[10px] font-bold text-orange-600 text-center mt-1 flex items-center justify-center gap-1">
                        <GripVertical className="w-3 h-3" />
                        <span>Moving Image...</span>
                      </div>
                    </div>
                  )}

                  {/* Screen reader aria-live announcements */}
                  <div className="sr-only" aria-live="polite" aria-atomic="true">
                    {ariaAnnouncement}
                  </div>
                </div>
              </div>
            ) : editorTab === 'preview' ? (
              <div
                className="prose prose-slate max-w-none text-slate-800 leading-relaxed min-h-[440px] p-6 bg-slate-50/80 rounded-xl border border-gray-200 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: formData.content_html }}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-gray-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">HTML Code View:</span>
                  <button
                    type="button"
                    onClick={handleOpenImageModal}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Insert figure markup at current cursor position"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Insert Image</span>
                  </button>
                </div>
                <textarea
                  name="content_html"
                  rows={18}
                  value={formData.content_html}
                  onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                  placeholder="<h2>Article Heading</h2>\n<p>Article content...</p>"
                  className="w-full p-4 rounded-xl border border-gray-200 font-mono text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50/50"
                />
              </div>
            )}
            {formErrors.content_html && <p className="text-[11px] text-red-600">{formErrors.content_html}</p>}
          </div>

          {/* FAQs Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-navy-900 text-xs">Article FAQs (Structured Data)</h3>
                <p className="text-[11px] text-slate-500">Included in the article accordion and Google FAQPage JSON-LD.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addFaqItem} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </Button>
            </div>

            <div className="space-y-3">
              {formData.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-orange-600 uppercase">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. How does Workday parse multi-column tables?"
                    value={faq.question}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-navy-900 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Provide a concrete answer..."
                    value={faq.answer}
                    onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-navy-900 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Schedule Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              Publishing &amp; Status
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Article Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live to Public)</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {formData.status === 'scheduled' && (
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Scheduled Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="featured-check"
                checked={formData.featured === 1}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-orange-500 rounded border-gray-300"
              />
              <label htmlFor="featured-check" className="text-xs font-semibold text-navy-900 cursor-pointer">
                Feature in Recent Highlights section
              </label>
            </div>
          </div>

          {/* Classification: Category & Author */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              Taxonomy &amp; Attribution
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                {meta.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Author *</label>
              <select
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: parseInt(e.target.value) })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                {meta.authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">Topic Tags</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-gray-200">
                {meta.tags.map((t) => {
                  const selected = formData.tag_ids.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTagSelection(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-navy-900 text-white'
                          : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Image Upload (Converts to WebP) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              16:9 Cover Image *
            </h3>

            {/* Preview Box */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-gray-200 relative">
              <img
                src={formData.cover_image}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Converting to WebP...</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <label className="block w-full">
                <span className="sr-only">Choose Cover Image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-1">Accepted: PNG, JPEG, WebP. Converted automatically to WebP 1200x675.</p>
            </div>

            {/* Cover Alt */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Cover Alt Text (SEO &amp; A11y) *</label>
              <input
                type="text"
                placeholder="Descriptive image summary..."
                value={formData.cover_alt}
                onChange={(e) => setFormData({ ...formData, cover_alt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
              {formErrors.cover_alt && <p className="text-[11px] text-red-600 mt-1">{formErrors.cover_alt}</p>}
            </div>
          </div>

          {/* SEO & Meta Fields */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              SEO &amp; Open Graph
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-600">SEO Meta Title</label>
                <span className="text-[10px] text-slate-400">{formData.seo_title.length}/60</span>
              </div>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Defaults to article title if blank"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-600">SEO Meta Description</label>
                <span className="text-[10px] text-slate-400">{formData.seo_description.length}/160</span>
              </div>
              <textarea
                rows={2}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Defaults to excerpt if blank"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── IMAGE INSERTION DIALOG MODAL ── */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onPaste={handlePasteFromClipboard}
        >
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-navy-900 text-sm">
                    Insert Image Anywhere in Content
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload new images or pick from your recent media library.
                  </p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageModalTab('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageModalTab === 'upload' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalTab('recent')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageModalTab === 'recent' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Recent Uploads ({recentMedia.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200/50 transition-colors ml-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {imageModalTab === 'upload' ? (
                <div className="space-y-4">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files) handleAddFilesToQueue(e.dataTransfer.files);
                    }}
                    className="p-6 border-2 border-dashed border-orange-200 hover:border-orange-400 rounded-2xl bg-orange-50/30 text-center space-y-2 cursor-pointer transition-colors"
                    onClick={() => imageFileInputRef.current?.click()}
                  >
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleAddFilesToQueue(e.target.files);
                      }}
                    />
                    <UploadCloud className="w-8 h-8 text-orange-500 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-navy-900">
                        Drag &amp; drop images here, paste from clipboard (Ctrl+V), or{' '}
                        <span className="text-orange-600 underline">browse files</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Accepts JPG, PNG, WebP, GIF, AVIF up to 10MB each (Multiple files supported). SVG is automatically rejected for security.
                      </p>
                    </div>
                  </div>

                  {/* Queued Files Configuration List */}
                  {queuedImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                        Files Ready for Insertion ({queuedImages.length})
                      </h4>

                      <div className="space-y-3">
                        {queuedImages.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3 text-xs"
                          >
                            <div className="flex items-start gap-4">
                              {/* Thumbnail Preview */}
                              <div className="w-24 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 relative group">
                                <img
                                  src={item.previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-bold bg-navy-900/80 text-white">
                                  #{idx + 1}
                                </span>
                              </div>

                              {/* Form Fields for this Image */}
                              <div className="flex-1 space-y-2.5">
                                {/* Alt Text & Decorative */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="font-bold text-navy-900 flex items-center gap-1">
                                      <span>Alt Text (Accessibility) *</span>
                                      {!item.isDecorative && (
                                        <span className="text-[10px] text-orange-600 font-semibold">(Required)</span>
                                      )}
                                    </label>
                                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer font-medium">
                                      <input
                                        type="checkbox"
                                        checked={item.isDecorative}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setQueuedImages((prev) =>
                                            prev.map((q) => (q.id === item.id ? { ...q, isDecorative: checked, alt: checked ? '' : q.alt } : q))
                                          );
                                        }}
                                        className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-400"
                                      />
                                      <span>Decorative image (empty alt)</span>
                                    </label>
                                  </div>
                                  <input
                                    type="text"
                                    disabled={item.isDecorative}
                                    value={item.alt}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQueuedImages((prev) =>
                                        prev.map((q) => (q.id === item.id ? { ...q, alt: val } : q))
                                      );
                                    }}
                                    placeholder={item.isDecorative ? 'Decorative image (screen readers will skip)' : 'e.g. Distributed event streaming architecture diagram in AWS'}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-slate-100"
                                  />
                                </div>

                                {/* Caption */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                    Figure Caption (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.caption}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQueuedImages((prev) =>
                                        prev.map((q) => (q.id === item.id ? { ...q, caption: val } : q))
                                      );
                                    }}
                                    placeholder="e.g. Figure 1: Kafka partition routing latency benchmarks across regions"
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                  />
                                </div>

                                {/* Alignment & Width Presets */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  {/* Alignment Selector */}
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                      Alignment
                                    </label>
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                                      {(['left', 'center', 'right'] as const).map((aln) => (
                                        <button
                                          key={aln}
                                          type="button"
                                          onClick={() => {
                                            setQueuedImages((prev) =>
                                              prev.map((q) => (q.id === item.id ? { ...q, align: aln } : q))
                                            );
                                          }}
                                          className={`flex-1 py-1 rounded text-xs font-semibold capitalize flex items-center justify-center gap-1 transition-all ${
                                            item.align === aln ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                                          }`}
                                        >
                                          {aln === 'left' && <AlignLeft className="w-3 h-3" />}
                                          {aln === 'center' && <AlignCenter className="w-3 h-3" />}
                                          {aln === 'right' && <AlignRight className="w-3 h-3" />}
                                          <span>{aln}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Size Preset Selector */}
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                      Width Preset ({item.size}%)
                                    </label>
                                    <div className="flex items-center gap-1">
                                      {[25, 33, 50, 66, 75, 100].map((sz) => (
                                        <button
                                          key={sz}
                                          type="button"
                                          onClick={() => {
                                            setQueuedImages((prev) =>
                                              prev.map((q) => (q.id === item.id ? { ...q, size: sz } : q))
                                            );
                                          }}
                                          className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                                            item.size === sz
                                              ? 'bg-navy-900 text-white shadow-2xs'
                                              : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-100'
                                          }`}
                                        >
                                          {sz}%
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Remove From Queue Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setQueuedImages((prev) => prev.filter((q) => q.id !== item.id))
                                }
                                className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Remove this file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Recent Uploads Tab */
                <div className="space-y-4">
                  {loadingRecentMedia ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      <span className="text-xs text-slate-500">Loading recent media uploads...</span>
                    </div>
                  ) : recentMedia.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-500 italic">
                      No previous uploads found. Switch to the "Upload from Device" tab to upload your first image.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      {/* Left: Media Grid */}
                      <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {recentMedia.map((media) => {
                          const isSelected = selectedRecentItem?.id === media.id;
                          return (
                            <button
                              key={media.id}
                              type="button"
                              onClick={() => {
                                setSelectedRecentItem(media);
                                setRecentAlt(media.original_name ? media.original_name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '');
                              }}
                              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 relative group cursor-pointer ${
                                isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-slate-300'
                              }`}
                            >
                              <img src={media.url} alt={media.filename} className="w-full h-full object-cover rounded-lg" />
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Selected Image Metadata & Controls */}
                      {selectedRecentItem ? (
                        <div className="md:col-span-5 p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3 text-xs">
                          <div className="aspect-video rounded-xl overflow-hidden bg-white border border-slate-200">
                            <img src={selectedRecentItem.url} alt="Selected" className="w-full h-full object-cover" />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-bold text-navy-900">Alt Text *</label>
                              <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={recentIsDecorative}
                                  onChange={(e) => setRecentIsDecorative(e.target.checked)}
                                  className="w-3.5 h-3.5 rounded text-orange-600"
                                />
                                <span>Decorative</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              disabled={recentIsDecorative}
                              value={recentAlt}
                              onChange={(e) => setRecentAlt(e.target.value)}
                              placeholder="Required alt text..."
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-navy-900 disabled:bg-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Caption (Optional)
                            </label>
                            <input
                              type="text"
                              value={recentCaption}
                              onChange={(e) => setRecentCaption(e.target.value)}
                              placeholder="Figure caption..."
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-navy-900"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-600">Alignment</label>
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                              {(['left', 'center', 'right'] as const).map((aln) => (
                                <button
                                  key={aln}
                                  type="button"
                                  onClick={() => setRecentAlign(aln)}
                                  className={`flex-1 py-1 rounded text-xs font-semibold capitalize flex items-center justify-center gap-1 ${
                                    recentAlign === aln ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {aln}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-600">
                              Width Preset ({recentSize}%)
                            </label>
                            <div className="flex items-center gap-1">
                              {[25, 33, 50, 66, 75, 100].map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setRecentSize(sz)}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold ${
                                    recentSize === sz ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-slate-600'
                                  }`}
                                >
                                  {sz}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="md:col-span-5 p-8 rounded-2xl bg-slate-50 border border-gray-200 text-center text-slate-400 text-xs italic">
                          Select an image from the library on the left to configure insertion.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs text-slate-500">
                {imageModalTab === 'upload'
                  ? `${queuedImages.length} image${queuedImages.length > 1 ? 's' : ''} queued`
                  : selectedRecentItem
                  ? `Selected: ${selectedRecentItem.filename}`
                  : 'Select an image'}
              </span>

              <div className="flex items-center gap-2.5">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsImageModalOpen(false)}>
                  Cancel
                </Button>
                {imageModalTab === 'upload' ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={queuedImages.length === 0 || isUploadingImages}
                    onClick={handleUploadAndInsertQueued}
                  >
                    {isUploadingImages ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        Uploading &amp; Inserting...
                      </>
                    ) : (
                      `Insert ${queuedImages.length} Image${queuedImages.length > 1 ? 's' : ''}`
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={!selectedRecentItem}
                    onClick={handleInsertRecentSelected}
                  >
                    Insert Selected Image
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
