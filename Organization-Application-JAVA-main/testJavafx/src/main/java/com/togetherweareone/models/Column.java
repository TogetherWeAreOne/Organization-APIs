package com.togetherweareone.models;

import java.util.ArrayList;

public class Column {

    public String id;
    public String title;
    public ArrayList<Task> tasks;

    public Column(String id, String title, ArrayList<Task> tasks) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<Task> getTasks() {
        return tasks;
    }
}
