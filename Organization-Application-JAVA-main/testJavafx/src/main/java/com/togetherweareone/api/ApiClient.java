package com.togetherweareone.api;

import org.eclipse.jetty.client.HttpClient;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.JettyClientHttpConnector;
import org.springframework.http.client.reactive.JettyResourceFactory;
import org.springframework.web.reactive.function.client.WebClient;


public class ApiClient {

    private static ApiClient instance;
    public WebClient webClient;

    public ApiClient() {
        this.webClient = WebClient.create("http://localhost:3000/organisation-app");
    }

    public ApiClient getInstance() {
        if (instance == null) {
            instance = new ApiClient();
        }
        return instance;
    }

    public JettyResourceFactory resourceFactory() {
        return new JettyResourceFactory();
    }

    public WebClient webClient() {

        HttpClient httpClient = new HttpClient();

        ClientHttpConnector connector =
                new JettyClientHttpConnector(httpClient);

        return WebClient.builder().clientConnector(connector).build();
    }

}
