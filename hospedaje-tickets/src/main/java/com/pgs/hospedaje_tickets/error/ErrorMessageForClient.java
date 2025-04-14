package com.pgs.hospedaje_tickets.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorMessageForClient {
    private String message;
    private String uri;

}
