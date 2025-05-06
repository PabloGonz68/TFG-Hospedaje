package com.pgs.hospedaje_tickets.security;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.InternalServerErrorException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Hospedaje;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

@Configuration
@EnableWebSecurity //Habilita la seguridad
public class SecurityConfig {

    //Esta clase contiene las llaves publicas y privadas para encriptar y desencriptar el token
    @Autowired
    private RsaKeyProperties keyProperties;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private HospedajeRepository hospedajeRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth->auth
                        //Funciones Usuario
                        .requestMatchers(HttpMethod.POST, "/usuario/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/register").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/usuario/{id}").access(getUserIdManager())
                        .requestMatchers(HttpMethod.PUT, "/usuario/changePassword/{id}").access(getUserIdManager())
                        //Puedes ver la informacion de cualquier perfil de otro usuario
                        .requestMatchers(HttpMethod.GET, "/usuario/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/usuario/{id}").access(getUserIdManager())
                        //Funciones Admin Usuario
                        .requestMatchers(HttpMethod.PUT, "/usuario/admin/{id}").authenticated()//admin update
                        .requestMatchers(HttpMethod.GET, "/usuario/admin/").authenticated()//admin get all

                        //Funciones Hospedaje
                        .requestMatchers(HttpMethod.GET, "/hospedaje/{id}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/hospedaje/").authenticated()
                        .requestMatchers(HttpMethod.POST, "/hospedaje/create").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/hospedaje/{id}").access(getHospedajeIdManager())
                        .requestMatchers(HttpMethod.DELETE, "/hospedaje/{id}").access(getHospedajeIdManager())

                        //Funciones Admin Hospedaje
                        .requestMatchers(HttpMethod.GET, "/hospedaje/admin").authenticated()

                        //Funciones Ticket
                        .requestMatchers(HttpMethod.GET, "/ticket/{id}").authenticated()

                        //Funciones Admin Ticket
                        .requestMatchers(HttpMethod.GET, "/ticket/all").authenticated()
                        .requestMatchers(HttpMethod.GET, "/ticket/{id}/admin").authenticated()
                        .requestMatchers(HttpMethod.POST, "/ticket/create").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/ticket/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/ticket/{id}").authenticated()

                        //Funciones GrupoViaje
                        .requestMatchers(HttpMethod.POST, "/grupo-viaje/create").authenticated()

                        //Funciones Reserva
                        .requestMatchers(HttpMethod.POST, "/reservas/con-grupo").authenticated()



                        //Cualquier otra petición debe estar autenticada
                        .anyRequest().authenticated()

                )
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth->oauth.jwt(Customizer.withDefaults()))
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    public AuthorizationManager<RequestAuthorizationContext> getUserIdManager() {
        //El autenticador se encarga de extraer el id del token y el object es el request
        return (authentication, object) -> {
            Authentication auth = authentication.get();

            if (auth==null || !auth.isAuthenticated()) {
                return new AuthorizationDecision(false);
            }

            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (isAdmin) {  //Si el usuario es admin
                return new AuthorizationDecision(true);
            }

            String path = object.getRequest().getRequestURI();
            String idString = path.substring(path.lastIndexOf("/") + 1);
            Long id = StringToLong.StringToLong(idString);

            if (id == null || id <= 0) {
                return new AuthorizationDecision(false);
            }

            Usuario usuario = null;
            try{
                usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
            } catch (InternalServerErrorException e) {
                throw new InternalServerErrorException("Error al obtener el usuario. "+e.getMessage());
            }

            if (usuario == null) {
                return new AuthorizationDecision(false);
            }

            if (!usuario.getEmail().equals(auth.getName())) {
                return new AuthorizationDecision(false);
            }

            return new AuthorizationDecision(true);
        };
    }

    public AuthorizationManager<RequestAuthorizationContext> getHospedajeIdManager() {
        //El autenticador se encarga de extraer el id del token y el object es el request
        return (authentication, object) -> {
            Authentication auth = authentication.get();

            if (auth==null || !auth.isAuthenticated()) {
                return new AuthorizationDecision(false);
            }

            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (isAdmin) {  //Si el usuario es admin
                return new AuthorizationDecision(true);
            }

            String path = object.getRequest().getRequestURI();
            String idString = path.substring(path.lastIndexOf("/") + 1);
            Long id = StringToLong.StringToLong(idString);

            if (id == null || id <= 0) {
                return new AuthorizationDecision(false);
            }

            Hospedaje hospedaje = null;
            try{
                hospedaje = hospedajeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El hospedaje no existe."));
            } catch (InternalServerErrorException e) {
                throw new InternalServerErrorException("Error al obtener el hospedaje. "+e.getMessage());
            }

            if (hospedaje == null) {
                return new AuthorizationDecision(false);
            }

            if (!hospedaje.getAnfitrion().getEmail().equals(auth.getName())) {
                return new AuthorizationDecision(false);
            }

            return new AuthorizationDecision(true);
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Decodificador
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(keyProperties.publicKey()).build();
    }

    //Codificador
    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(keyProperties.publicKey()).privateKey(keyProperties.privateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }


}
