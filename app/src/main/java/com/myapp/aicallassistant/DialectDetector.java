package com.myapp.aicallassistant;

public class DialectDetector {
    public static String detectDialect(String text) {
        if (text == null) return "";
        String t = text.trim().toLowerCase();
        // Very rough heuristics for demo only
        if (t.contains("شو") || t.contains("كيفك") || t.contains("منيح")) return "شامي";
        if (t.contains("واش") || t.contains("بزاف") || t.contains("شحال")) return "مغربي/جزائري";
        if (t.contains("شلونك") || t.contains("خابرني")) return "عراقي";
        if (t.contains("ايش") || t.contains("تمام")) return "خليجي";
        if (t.contains("بتعمل") || t.contains("دلوقتي") || t.contains("عايز")) return "مصري";
        if (t.contains("شنو")) return "سوداني/خليجي";
        return "";
    }
}