package com.togetherweareone.services;


import com.togetherweareone.models.User;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


public class AuthService {


    public User login(WebClient webClient, String email, String password) {


        return webClient.post()
                .uri("/auth/login").contentType(MediaType.TEXT_PLAIN)
                .body(BodyInserters.fromFormData("email", "test@gmail.com")
                        .with("password", "test"))
                .retrieve()
                .bodyToMono(User.class)
                .block();

    }


}
