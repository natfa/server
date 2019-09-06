DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `themes`;
DROP TABLE IF EXISTS `subjects`;


CREATE TABLE `subjects` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL
);


CREATE TABLE `themes` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `subjectid` INT UNSIGNED NOT NULL,
  `themeid` INT UNSIGNED,
  FOREIGN KEY (subjectid)
    REFERENCES subjects (id)
    ON DELETE CASCADE,
  FOREIGN KEY (themeid)
    REFERENCES themes (id)
    ON DELETE CASCADE
);


CREATE TABLE `questions` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(150) NOT NULL,
  `points` INT UNSIGNED NOT NULL,
  `subjectid` INT UNSIGNED,
  `themeid` INT UNSIGNED,
  FOREIGN KEY (subjectid)
    REFERENCES subjects (id)
    ON DELETE SET NULL,
  FOREIGN KEY (themeid)
    REFERENCES themes (id)
    ON DELETE SET NULL
);


CREATE TABLE `answers` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(150) NOT NULL,
  `correct` BOOLEAN NOT NULL,
  `questionid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (questionid)
    REFERENCES questions (id)
    ON DELETE CASCADE
);


CREATE TABLE `media` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `content` MEDIUMBLOB NOT NULL,
  `questionid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (questionid)
    REFERENCES questions (id)
    ON DELETE CASCADE
);
