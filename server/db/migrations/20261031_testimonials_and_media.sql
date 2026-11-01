-- Additive Migration: 20261031_testimonials_and_media.sql
-- Idempotent schema upgrades for Blog Media library and Testimonials Management

-- 1. Create blog_media table if it does not exist
CREATE TABLE IF NOT EXISTS `blog_media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `bytes` INT NOT NULL,
  `uploaded_by` VARCHAR(100) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_blog_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Add additive columns to testimonials table safely
DELIMITER $$

DROP PROCEDURE IF EXISTS `AddTestimonialsColumns`$$
CREATE PROCEDURE `AddTestimonialsColumns`()
BEGIN
  -- reviewer_type
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'reviewer_type') THEN
    ALTER TABLE `testimonials` ADD COLUMN `reviewer_type` VARCHAR(50) NOT NULL DEFAULT 'candidate';
  END IF;

  -- company_name
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'company_name') THEN
    ALTER TABLE `testimonials` ADD COLUMN `company_name` VARCHAR(150) NULL;
  END IF;

  -- placement
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'placement') THEN
    ALTER TABLE `testimonials` ADD COLUMN `placement` VARCHAR(150) NULL;
  END IF;

  -- highlight_metric
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'highlight_metric') THEN
    ALTER TABLE `testimonials` ADD COLUMN `highlight_metric` VARCHAR(150) NULL;
  END IF;

  -- avatar_url
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'avatar_url') THEN
    ALTER TABLE `testimonials` ADD COLUMN `avatar_url` VARCHAR(255) NULL;
  END IF;

  -- show_in_spotlight
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'show_in_spotlight') THEN
    ALTER TABLE `testimonials` ADD COLUMN `show_in_spotlight` TINYINT(1) NOT NULL DEFAULT 0;
  END IF;

  -- is_main_highlight
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'is_main_highlight') THEN
    ALTER TABLE `testimonials` ADD COLUMN `is_main_highlight` TINYINT(1) NOT NULL DEFAULT 0;
  END IF;

  -- show_in_cards
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'show_in_cards') THEN
    ALTER TABLE `testimonials` ADD COLUMN `show_in_cards` TINYINT(1) NOT NULL DEFAULT 1;
  END IF;

  -- spotlight_order
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'spotlight_order') THEN
    ALTER TABLE `testimonials` ADD COLUMN `spotlight_order` INT NOT NULL DEFAULT 0;
  END IF;

  -- card_order
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'card_order') THEN
    ALTER TABLE `testimonials` ADD COLUMN `card_order` INT NOT NULL DEFAULT 0;
  END IF;

  -- permission_confirmed
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'permission_confirmed') THEN
    ALTER TABLE `testimonials` ADD COLUMN `permission_confirmed` TINYINT(1) NOT NULL DEFAULT 1;
  END IF;

  -- permission_confirmed_at
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'permission_confirmed_at') THEN
    ALTER TABLE `testimonials` ADD COLUMN `permission_confirmed_at` DATETIME NULL;
  END IF;

  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'updated_at') THEN
    ALTER TABLE `testimonials` ADD COLUMN `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  END IF;
END$$

DELIMITER ;

CALL `AddTestimonialsColumns`();
DROP PROCEDURE IF EXISTS `AddTestimonialsColumns`;

-- 3. Idempotently populate and update initial Home section testimonials
INSERT INTO `testimonials` (`id`, `name`, `role`, `placement`, `quote`, `reviewer_type`, `highlight_metric`, `is_sample`, `is_published`, `consent_confirmed`, `permission_confirmed`, `show_in_spotlight`, `is_main_highlight`, `show_in_cards`, `spotlight_order`, `card_order`)
VALUES
(1, 'Michael R.', 'Senior AWS DevOps Engineer', 'Placed at CloudScale Systems', 'Codex Tech-IT did not just find me a job—they completely revamped how I present my architectural experience. I landed an offer with a $35k jump in 3 weeks.', 'candidate', '+$35k Salary Jump · 21 Days', 1, 1, 1, 1, 0, 0, 1, 0, 1),
(2, 'Swetha K.', 'Full Stack Java Developer', 'Placed at Apex Healthcare IT', 'As an F1-OPT graduate, finding a genuine employer willing to sponsor was overwhelming. Codex connected me directly with an e-verified financial institution in under a month.', 'candidate', 'Direct Client · E-Verified', 1, 1, 1, 1, 0, 0, 1, 0, 2),
(3, 'Jason Miller', 'VP of Engineering', 'CloudScale Systems Hiring Partner', 'Most staffing firms spam us with 50 irrelevant resumes. Codex sent us 3 pre-screened candidates, and we hired 2 of them within 10 days. Outstanding quality.', 'employer', '2 Hires in 10 Days · Partner', 1, 1, 1, 1, 0, 0, 1, 0, 3),
(4, 'Anita Deshmukh', 'Lead Data Engineer', 'Placed at Starlight Data Labs', 'The PySpark and Snowflake positioning gave me the exact hands-on ammunition I needed for technical grilling rounds. Their interview coaching is gold.', 'candidate', 'Data Architecture · Placed', 1, 1, 1, 1, 0, 0, 1, 0, 4),
(5, 'Robert C.', 'Kubernetes Platform SRE', 'Placed at SecureCore CyberTech', 'The resume review tool gave me concrete fixes that immediately doubled my LinkedIn inbound recruiter messages. Direct hiring manager representation made the difference.', 'candidate', 'Inbound Inquiries 2x · Placed', 1, 1, 1, 1, 1, 0, 1, 1, 5),
(6, 'Tanya Gomez', 'QA Automation Engineer', 'Placed at OmniLogistics Core', 'Switching from manual testing felt daunting. Codex taught me Playwright, helped me build a live portfolio, and backed me through every technical defense round.', 'candidate', 'Skill Transition · Placed', 1, 1, 1, 1, 1, 0, 1, 2, 6),
(7, 'David L.', 'Cloud Infrastructure Director', 'Placed at FinTech Global', 'Their direct client representation helped me negotiate a compensation package 22% higher than my initial target. A true partner in senior tech placements.', 'candidate', '+22% Offer Growth · Executive', 1, 1, 1, 1, 1, 0, 0, 3, 0),
(8, 'Priya Patel', 'Enterprise Solutions Architect', 'Placed at Nexus Capital Tech', 'The system design coaching transformed how I tackle whiteboard architectural challenges. Placed within 18 business days of starting.', 'candidate', '18 Days to Offer · Sample', 1, 1, 1, 1, 1, 1, 0, 4, 0),
(9, 'Elena Rostova', 'Director of Talent Acquisition', 'FinTech Global Client Partner', 'We filled our mission-critical Kubernetes Lead position within two weeks. The candidates from Codex had already been vetted on real infrastructure scenarios.', 'employer', '14 Days Time-to-Fill · Partner', 1, 1, 1, 1, 0, 0, 0, 0, 0)
ON DUPLICATE KEY UPDATE
  `placement` = VALUES(`placement`),
  `reviewer_type` = VALUES(`reviewer_type`),
  `highlight_metric` = VALUES(`highlight_metric`),
  `show_in_spotlight` = VALUES(`show_in_spotlight`),
  `is_main_highlight` = VALUES(`is_main_highlight`),
  `show_in_cards` = VALUES(`show_in_cards`),
  `spotlight_order` = VALUES(`spotlight_order`),
  `card_order` = VALUES(`card_order`),
  `permission_confirmed` = VALUES(`permission_confirmed`),
  `is_published` = VALUES(`is_published`);

