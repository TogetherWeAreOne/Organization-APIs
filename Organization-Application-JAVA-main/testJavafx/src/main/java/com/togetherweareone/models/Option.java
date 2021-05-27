package com.togetherweareone.models;

public class Option {

    public String id;
    public String title;
    public Boolean checked;

    public Option(String title, Boolean checked) {
        this.title = title;
        this.checked = checked;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Boolean getChecked() {
        return checked;
    }
}
