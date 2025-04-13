package com.pgs.hospedaje_tickets;

import com.pgs.hospedaje_tickets.security.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class HospedajeTicketsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospedajeTicketsApplication.class, args);
	}

}
