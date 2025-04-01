package com.pgs.hospedaje_tickets.utils;

import org.springframework.stereotype.Component;

@Component
public class StringToLong {
    public static Long StringToLong(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            return null;//Cambiar cuando tenga las excepciones ;)
        }

    }
}
