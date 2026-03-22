import type { Usuario, TipoUsuario } from "@/types";
import { UsuarioMockado } from "@/mocks/auth";
import { useState, useEffect, useCallback } from 'react';

const AUTH_USUARIO_CHAVE = 'auth_usuario';
const AUTH_TOKEN_CHAVE = 'auth_token';

interface RespostaLoginAPI {
  token: string;
  user: {
    id: number;
    email: string;
    tipo: 'EMPRESA' | 'CANDIDATO';
    candidato_perfil: {
      salario_expectativa: string;
      experiencia: string;
      nivel_educacao: number;
    } | null;
  };
}

function normalizarTipo(tipo: 'EMPRESA' | 'CANDIDATO'): TipoUsuario {
  return tipo === 'EMPRESA' ? 'empresa' : 'candidato';
}

function normalizarUsuario(user: RespostaLoginAPI['user']): Usuario {
  return {
    id: user.id,
    nome: user.email.split('@')[0],
    email: user.email,
    tipo: normalizarTipo(user.tipo),
    perfil: user.candidato_perfil
      ? {
        expectativa_salarial: Number(user.candidato_perfil.salario_expectativa),
        experiencia: user.candidato_perfil.experiencia,
        educacao_recente: String(user.candidato_perfil.nivel_educacao),
      }
    : undefined,
  };
}

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const usuarioAuthenticado = localStorage.getItem(AUTH_USUARIO_CHAVE);
    return usuarioAuthenticado ? JSON.parse(usuarioAuthenticado) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_CHAVE);
  })

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(AUTH_USUARIO_CHAVE, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(AUTH_USUARIO_CHAVE);
    }
  }, [usuario]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_CHAVE, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_CHAVE);
    }
  }, [token]);  

  const login = useCallback((dados: RespostaLoginAPI) => {
    setToken(dados.token);
    setUsuario(normalizarUsuario(dados.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
  }, []);

  return { usuario, login, logout };
}
