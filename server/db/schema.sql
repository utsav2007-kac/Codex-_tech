
-- CODEX TECH-IT MySQL 8 / MariaDB Schema (utf8mb4, InnoDB)
-- Compatible with XAMPP, phpMyAdmin, MySQL Workbench

CREATE DATABASE IF NOT EXISTS `codex_tech_it` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `codex_tech_it`;

-- 1. admin_users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. leads (consultations)
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `country_code` VARCHAR(10) NOT NULL DEFAULT '+1',
  `current_role` VARCHAR(100) NOT NULL,
  `experience_level` VARCHAR(50) NOT NULL,
  `visa_status` ENUM('F1','H1B_H4','US_CITIZEN_GC','OTHER','NA') NOT NULL DEFAULT 'NA',
  `service_interest` VARCHAR(100) NOT NULL,
  `preferred_datetime` VARCHAR(100) NULL,
  `source` VARCHAR(100) NULL DEFAULT 'website',
  `plan` VARCHAR(100) NULL,
  `message` TEXT NULL,
  `consent` BOOLEAN NOT NULL DEFAULT TRUE,
  `status` ENUM('NEW','CONTACTED','CLOSED') NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_leads_email` (`email`),
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contacts_email` (`email`),
  INDEX `idx_contacts_status` (`status`),
  INDEX `idx_contacts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. employer_requests
CREATE TABLE IF NOT EXISTS `employer_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company` VARCHAR(150) NOT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `roles_needed` VARCHAR(255) NOT NULL,
  `tech_stack` VARCHAR(255) NOT NULL,
  `headcount` VARCHAR(50) NOT NULL,
  `hiring_model` VARCHAR(100) NOT NULL,
  `timeline` VARCHAR(100) NOT NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_employer_email` (`email`),
  INDEX `idx_employer_status` (`status`),
  INDEX `idx_employer_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. job_openings
CREATE TABLE IF NOT EXISTS `job_openings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `requirements` LONGTEXT NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_job_slug` (`slug`),
  INDEX `idx_job_active` (`is_active`),
  INDEX `idx_job_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. applications
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `resume_path` VARCHAR(255) NOT NULL,
  `resume_original_name` VARCHAR(255) NOT NULL,
  `cover_note` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_app_job_id` (`job_id`),
  INDEX `idx_app_email` (`email`),
  INDEX `idx_app_status` (`status`),
  INDEX `idx_app_created_at` (`created_at`),
  CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. referrals
CREATE TABLE IF NOT EXISTS `referrals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `referrer_name` VARCHAR(100) NOT NULL,
  `referrer_email` VARCHAR(191) NOT NULL,
  `referrer_phone` VARCHAR(50) NOT NULL,
  `referee_name` VARCHAR(100) NOT NULL,
  `referee_email` VARCHAR(191) NOT NULL,
  `referee_phone` VARCHAR(50) NOT NULL,
  `role_skill` VARCHAR(200) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ref_referrer_email` (`referrer_email`),
  INDEX `idx_ref_referee_email` (`referee_email`),
  INDEX `idx_ref_status` (`status`),
  INDEX `idx_ref_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. subscribers
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_subscribers_email` (`email`),
  INDEX `idx_subscribers_active` (`is_active`),
  INDEX `idx_subscribers_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `summary` TEXT NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `mode` VARCHAR(50) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `curriculum` JSON NOT NULL,
  `tools` JSON NOT NULL,
  `outcomes` JSON NOT NULL,
  `faqs` JSON NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_course_slug` (`slug`),
  INDEX `idx_course_active` (`is_active`),
  INDEX `idx_course_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `batch_pref` VARCHAR(100) NOT NULL,
  `message` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_enrollment_course_id` (`course_id`),
  INDEX `idx_enrollment_email` (`email`),
  INDEX `idx_enrollment_status` (`status`),
  INDEX `idx_enrollment_created_at` (`created_at`),
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. webinars
CREATE TABLE IF NOT EXISTS `webinars` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `starts_at` DATETIME NOT NULL,
  `host` VARCHAR(100) NOT NULL,
  `join_url` VARCHAR(255) NULL,
  `is_past` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_webinar_slug` (`slug`),
  INDEX `idx_webinar_past` (`is_past`),
  INDEX `idx_webinar_starts_at` (`starts_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. webinar_registrations
CREATE TABLE IF NOT EXISTS `webinar_registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `webinar_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_web_reg_id` (`webinar_id`),
  INDEX `idx_web_reg_email` (`email`),
  INDEX `idx_web_reg_created_at` (`created_at`),
  CONSTRAINT `fk_webinar_reg` FOREIGN KEY (`webinar_id`) REFERENCES `webinars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. posts (insights/blog)
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `author_name` VARCHAR(100) NOT NULL,
  `author_role` VARCHAR(100) NOT NULL,
  `cover_alt` VARCHAR(255) NOT NULL,
  `read_minutes` INT NOT NULL DEFAULT 5,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_posts_slug` (`slug`),
  INDEX `idx_posts_category` (`category`),
  INDEX `idx_posts_published` (`is_published`),
  INDEX `idx_posts_published_at` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. success_stories
CREATE TABLE IF NOT EXISTS `success_stories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `company_type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `situation` LONGTEXT NOT NULL,
  `approach` LONGTEXT NOT NULL,
  `results` LONGTEXT NOT NULL,
  `is_sample` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_stories_slug` (`slug`),
  INDEX `idx_stories_published` (`is_published`),
  INDEX `idx_stories_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. live_placements
CREATE TABLE IF NOT EXISTS `live_placements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role` VARCHAR(100) NOT NULL,
  `company_type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `package_range` VARCHAR(100) NOT NULL,
  `summary` VARCHAR(255) NOT NULL,
  `is_sample` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_placements_published` (`is_published`),
  INDEX `idx_placements_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX `idx_faqs_category` (`category`),
  INDEX `idx_faqs_published` (`is_published`),
  INDEX `idx_faqs_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `quote` TEXT NOT NULL,
  `is_sample` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX `idx_testimonials_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. interview_questions
CREATE TABLE IF NOT EXISTS `interview_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_track` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` LONGTEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  INDEX `idx_iq_role` (`role_track`),
  INDEX `idx_iq_level` (`level`),
  INDEX `idx_iq_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. downloads
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resource_key` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_downloads_key` (`resource_key`),
  INDEX `idx_downloads_email` (`email`),
  INDEX `idx_downloads_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. tool_reports
CREATE TABLE IF NOT EXISTS `tool_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tool` ENUM('RESUME','LINKEDIN','MATCH','READINESS') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `score` INT NOT NULL,
  `report_json` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tool_type` (`tool`),
  INDEX `idx_tool_email` (`email`),
  INDEX `idx_tool_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. email_logs
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `to_email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'SENT',
  `error` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_to` (`to_email`),
  INDEX `idx_email_status` (`status`),
  INDEX `idx_email_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. chat_faq
CREATE TABLE IF NOT EXISTS `chat_faq` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `keywords` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
