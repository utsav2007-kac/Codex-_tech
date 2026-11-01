-- Rollback Script: 20261031_testimonials_and_media_rollback.sql
-- Safely reverts the additive changes made for Blog Media and Testimonials Management

-- 1. Drop blog_media table if exists
DROP TABLE IF EXISTS `blog_media`;

-- 2. Drop additive columns from testimonials table
DELIMITER $$

DROP PROCEDURE IF EXISTS `RollbackTestimonialsColumns`$$
CREATE PROCEDURE `RollbackTestimonialsColumns`()
BEGIN
  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'reviewer_type') THEN
    ALTER TABLE `testimonials` DROP COLUMN `reviewer_type`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'company_name') THEN
    ALTER TABLE `testimonials` DROP COLUMN `company_name`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'placement') THEN
    ALTER TABLE `testimonials` DROP COLUMN `placement`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'highlight_metric') THEN
    ALTER TABLE `testimonials` DROP COLUMN `highlight_metric`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'avatar_url') THEN
    ALTER TABLE `testimonials` DROP COLUMN `avatar_url`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'show_in_spotlight') THEN
    ALTER TABLE `testimonials` DROP COLUMN `show_in_spotlight`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'is_main_highlight') THEN
    ALTER TABLE `testimonials` DROP COLUMN `is_main_highlight`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'show_in_cards') THEN
    ALTER TABLE `testimonials` DROP COLUMN `show_in_cards`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'spotlight_order') THEN
    ALTER TABLE `testimonials` DROP COLUMN `spotlight_order`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'card_order') THEN
    ALTER TABLE `testimonials` DROP COLUMN `card_order`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'permission_confirmed') THEN
    ALTER TABLE `testimonials` DROP COLUMN `permission_confirmed`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'permission_confirmed_at') THEN
    ALTER TABLE `testimonials` DROP COLUMN `permission_confirmed_at`;
  END IF;

  IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'updated_at') THEN
    ALTER TABLE `testimonials` DROP COLUMN `updated_at`;
  END IF;
END$$

DELIMITER ;

CALL `RollbackTestimonialsColumns`();
DROP PROCEDURE IF EXISTS `RollbackTestimonialsColumns`;

