CREATE DATABASE IF NOT EXISTS `dodgetracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `dodgetracker`;

-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dodgetracker
-- ------------------------------------------------------
-- Server version	8.0.39
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dodges`
--
DROP TABLE IF EXISTS `dodges`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `dodges` (
        `dodgeId` int NOT NULL AUTO_INCREMENT,
        `summonerId` varchar(64) DEFAULT NULL,
        `lpLost` int DEFAULT NULL,
        `rank` enum ('demoted', 'master', 'grandmaster', 'challenger') NOT NULL DEFAULT 'demoted',
        `dodgeDate` datetime DEFAULT NULL,
        `leaguePoints` int DEFAULT NULL,
        `region` varchar(8) NOT NULL DEFAULT 'NA',
        `timeInserted` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`dodgeId`),
        KEY `idx_dodge_summoner_region` (`summonerId`, `region`),
        KEY `idx_dodge_id` (`dodgeId` DESC),
        KEY `idx_summoner_region_dodge_date` (`summonerId`, `region`, `dodgeDate` DESC)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2718 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `errorlog`
--
DROP TABLE IF EXISTS `errorlog`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `errorlog` (
        `id` int NOT NULL AUTO_INCREMENT,
        `errorType` varchar(50) DEFAULT NULL,
        `summonerId` varchar(64) DEFAULT NULL,
        `region` varchar(8) DEFAULT NULL,
        `data` text,
        `errorMessage` text,
        `occurredAt` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 29 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `regions`
--
DROP TABLE IF EXISTS `regions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `regions` (
        `region` varchar(10) NOT NULL,
        `rank` enum ('demoted', 'master', 'grandmaster', 'challenger') NOT NULL,
        `totalNum` int DEFAULT NULL,
        `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`region`, `rank`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `summoner`
--
DROP TABLE IF EXISTS `summoner`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `summoner` (
        `summonerId` varchar(64) NOT NULL,
        `sumNumber` int NOT NULL AUTO_INCREMENT,
        `leaguePoints` int DEFAULT NULL,
        `gamesPlayed` int DEFAULT NULL,
        `rank` enum ('demoted', 'master', 'grandmaster', 'challenger') NOT NULL DEFAULT 'demoted',
        `iconId` int DEFAULT '23',
        `summonerLevel` int DEFAULT NULL,
        `puuid` varchar(128) DEFAULT NULL,
        `gameName` varchar(64) DEFAULT NULL,
        `tagLine` varchar(32) DEFAULT NULL,
        `region` varchar(8) NOT NULL DEFAULT 'NA',
        `lastUpdated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`summonerId`, `region`),
        UNIQUE KEY `sumNumber` (`sumNumber`),
        KEY `idx_summoner_id_region` (`summonerId`, `region`),
        KEY `idx_game_name_tagline_region` (`gameName`, `tagLine`, `region`),
        KEY `idx_rank_region` (`rank`, `region`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 20471 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'dodgetracker'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09  1:05:26