package com.togetherweareone.models;

import java.util.ArrayList;

public class Project {

    public String id;
    public String title;
    public String description;
    public ArrayList<Column> columns;

    public Project(String id, String title, String description, ArrayList<Column> columns) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columns = columns;
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

    public ArrayList<Column> getColumns() {
        return columns;
    }
}
