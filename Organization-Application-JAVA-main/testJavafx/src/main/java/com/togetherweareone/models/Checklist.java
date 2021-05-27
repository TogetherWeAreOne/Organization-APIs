package com.togetherweareone.models;

import java.util.ArrayList;

public class Checklist {

    public String id;
    public String title;
    public ArrayList<Option> options;

    public Checklist(String id, String title, ArrayList<Option> options) {
        this.id = id;
        this.title = title;
        this.options = options;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<Option> getOptions() {
        return options;
    }
}
