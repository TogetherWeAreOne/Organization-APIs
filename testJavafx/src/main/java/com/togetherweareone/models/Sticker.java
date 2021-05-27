package com.togetherweareone.models;

public class Sticker {

    public String id;
    public String title;
    public String color;

    public Sticker(String id, String title, String color) {
        this.id = id;
        this.title = title;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getColor() {
        return color;
    }
}
