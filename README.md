Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

This is the dev branch for Respond 2.10 (May 2014)

New in 2.10:
- Paypal IPN support to track transactions
- Receipt email for successful payments
- Digital download support (beta)
- Drag-and-Drop new elements into the editor
- Improved site administration (delete site)
- Load theme page from Load Layout widget
- PayPal Logo and Favicon / Touch / Tile logo support
- Choose whether you want your images resized (app.php)
- Cleaner Advanced theme (settings slide down menu)
- Theme logos, improved theme layout
- Captcha support for site forms, site registration
- Image thumb in map for lists
- New Bootswatch theme support: Lumen, Superhero, Darkly
- Bootstrap 3.1.1 update
- Duplicate block in editor
- Theme color picker in branding

Bug fixes:
- Resize image bug
- Stripe subscriptions update

Refactoring:
- None

How to update from 2.9:
- Backup your DB and sites
- Add Transactions table to track transactions

```
CREATE TABLE IF NOT EXISTS `Transactions` (
  `TransactionId` int(11) NOT NULL AUTO_INCREMENT,
  `TransactionUniqId` varchar(50) NOT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `Processor` varchar(50) DEFAULT NULL,
  `ProcessorTransactionId` varchar(256) DEFAULT NULL,
  `ProcessorStatus` varchar(50) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `PayerId` varchar(256) DEFAULT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `Shipping` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Fee` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Tax` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Total` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Currency` varchar(10) DEFAULT 'USD',
  `Items` text,
  `Data` text,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`TransactionId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
```
- Update Sites table
```
ALTER TABLE  `Sites` ADD `PayPalUseSandbox` INT NOT NULL DEFAULT '0' AFTER `PayPalId`;
ALTER TABLE  `Sites` ADD `PayPalLogoUrl` VARCHAR(512) NULL AFTER `PaypalUseSandbox`;
ALTER TABLE  `Sites` ADD `IconUrl` VARCHAR(512) NULL AFTER `LogoUrl`;
ALTER TABLE  `Sites` ADD `IconBg` VARCHAR(10) DEFAULT '#FFFFFF' AFTER `IconUrl`;
ALTER TABLE `Sites` ADD `AnalyticsSubdomain` TINYINT NOT NULL DEFAULT '0' AFTER `AnalyticsId`;
ALTER TABLE `Sites` ADD `AnalyticsMultidomain` TINYINT NOT NULL DEFAULT '0' AFTER `AnalyticsSubdomain`;
ALTER TABLE `Sites` ADD `AnalyticsDomain` VARCHAR(240) NULL AFTER `AnalyticsMultidomain`;
ALTER TABLE `Sites` ADD `FormPrivateId` VARCHAR(240) NULL AFTER `AnalyticsDomain`;
ALTER TABLE `Sites` ADD `FormPublicId` VARCHAR(240) NULL AFTER `FormPrivateId`;
```

- Re-publish your sites




