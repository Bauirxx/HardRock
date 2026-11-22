package com.gym.auth.model;

import com.gym.common.enums.Perfil;
import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "utilizadores")
public class UserEntity extends BaseEntity implements UserDetails {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Perfil perfil = Perfil.USUARIO_NORMAL;

    // Role detalhado usado pelo frontend (personal_trainer, internal_client,
    // external_client, staff, admin) — o perfil é para autorização, o role para o UI.
    @Column(length = 30)
    private String role;

    @Column(length = 150)
    private String especialidade;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 200)
    private String disponibilidade;

    @Column(length = 30)
    private String telefone;

    @Column(name = "foto_url", columnDefinition = "TEXT")
    private String fotoUrl;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    @Override
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getDisponibilidade() { return disponibilidade; }
    public void setDisponibilidade(String disponibilidade) { this.disponibilidade = disponibilidade; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    @Override
    public String getUsername() { return email; }
}
