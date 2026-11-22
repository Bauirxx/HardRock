package com.gym.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int status;
    private String mensagem;
    private T dados;
    private String erro;
    private String path;
    private LocalDateTime timestamp;

    private ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> sucesso(T dados, String mensagem) {
        ApiResponse<T> r = new ApiResponse<>();
        r.status = 200;
        r.mensagem = mensagem;
        r.dados = dados;
        return r;
    }

    public static <T> ApiResponse<T> sucesso(T dados) {
        return sucesso(dados, "Operação realizada com sucesso");
    }

    public static <T> ApiResponse<T> criado(T dados) {
        ApiResponse<T> r = new ApiResponse<>();
        r.status = 201;
        r.mensagem = "Recurso criado com sucesso";
        r.dados = dados;
        return r;
    }

    public static <T> ApiResponse<T> erro(int status, String erro, String mensagem, String path) {
        ApiResponse<T> r = new ApiResponse<>();
        r.status = status;
        r.erro = erro;
        r.mensagem = mensagem;
        r.path = path;
        return r;
    }

    public int getStatus() { return status; }
    public String getMensagem() { return mensagem; }
    public T getDados() { return dados; }
    public String getErro() { return erro; }
    public String getPath() { return path; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
