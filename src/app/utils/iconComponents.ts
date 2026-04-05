import { FaDev, FaGraduationCap, FaKaggle } from "react-icons/fa";
import { FiFlag, FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import {
  SiHackthebox,
  SiLeetcode,
  SiMedium,
  SiStackoverflow,
  SiTryhackme,
} from "react-icons/si";

export const iconComponents: { [key: string]: any } = {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiFlag,
  SiLeetcode,
  SiTryhackme,
  SiHackthebox,
  FaGraduationCap,
  FaKaggle,
  SiStackoverflow,
  SiMedium,
  FaDev,
  // Backward-compatible aliases for existing JSON values.
  FiTryhackme: SiTryhackme,
};
