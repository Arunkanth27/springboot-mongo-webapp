package com.community.demo.config;

import com.community.demo.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/",
                    "/api/auth/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/uploads/**",
                    
                    // Community endpoints
                    "/api/communities",
                    "/api/communities/**",
                    "/api/communities/name/**",
                    "/api/auth/users/**",
                    
                    // Post endpoints
                    "/api/posts",
                    "/api/posts/recent",
                    "/api/posts/**",
                    "/api/posts/by-community/**",
                    "/api/posts/{postId}/like",
                    "/api/posts/{postId}/unlike",
                    "/api/stats/**",
                    
                    // Comment endpoints
                    "/api/comments",
                    "/api/comments/post/**",      // GET comments for post
                    "/api/comments/{commentId}",  // DELETE comment
                    
                    // Reply endpoints
                    "/api/comments/{commentId}/replies",      // POST reply
                    "/api/comments/{commentId}/replies/**",
                    
                    "/api/chat/" ,
                    "/api/chat/message" ,
                    "/api/chat/send" ,
                    "/api/chat/conversation" 
                ).permitAll()
                
                // Role-based permissions
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}