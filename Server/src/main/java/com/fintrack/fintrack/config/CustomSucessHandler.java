package com.fintrack.fintrack.config;

import com.fintrack.fintrack.entity.Roles;
import com.fintrack.fintrack.entity.User;
import com.fintrack.fintrack.repository.RoleRepository;
import com.fintrack.fintrack.repository.UserRepository;
import com.fintrack.fintrack.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomSucessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Value("${frontend-url}")
    private String frontendUrl;

    @Autowired
    private UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            String email = Optional.ofNullable(attributes.get("email"))
                    .map(Object::toString)
                    .orElse("");
            String name = attributes.getOrDefault("login", "").toString();
            Optional<User> userData = userService.findByUser(name);
            if(userData.isPresent()){
                User user = userData.get();
                Set<Roles> rolesSet = new HashSet<>();
                Roles roles = roleRepository.findByRole(user.getRole());
                rolesSet.add(roles);
                List<SimpleGrantedAuthority> authorities = rolesSet.stream()
                        .map(role -> new SimpleGrantedAuthority(role.getRole()))
                        .collect(Collectors.toList());
                DefaultOAuth2User newUser = new DefaultOAuth2User(authorities, attributes, "id");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, authorities, oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            }else{
                User userEntity = new User();
                Set<Roles> rolesSet = new HashSet<>();
                Roles userRole = roleRepository.findByRole("USER");
                rolesSet.add(userRole);
                userEntity.setRole("USER");
                userEntity.setEmail(email);
                userEntity.setUsername(name);
                userEntity.setRegistrationSource("GITHUB");
                userService.save(userEntity);
                List<SimpleGrantedAuthority> authorities = rolesSet.stream()
                        .map(role -> new SimpleGrantedAuthority(role.getRole()))
                        .collect(Collectors.toList());
                DefaultOAuth2User newUser = new DefaultOAuth2User(authorities, attributes, "id");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, authorities, oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            }
            this.setDefaultTargetUrl("http://localhost:8089/v1/finTrack");
            this.setAlwaysUseDefaultTargetUrl(true);
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}
