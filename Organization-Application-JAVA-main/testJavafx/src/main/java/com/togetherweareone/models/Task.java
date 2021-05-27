package com.togetherweareone.models;

import java.util.ArrayList;

public class Task {

    public String id;
    public String title;
    public String description;
    public String priority;
    public ArrayList<Checklist> Checklists;

    public Task(String id, String title, String description, String priority, ArrayList<Checklist> checklists) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        Checklists = checklists;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public ArrayList<Checklist> getChecklists() {
        return Checklists;
    }
}
