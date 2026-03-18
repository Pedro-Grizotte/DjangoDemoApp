import type { Usuario, TipoUsuario } from "@/types";
import { UsuarioMockado } from "@/mocks/auth";
import { useState, useEffect, useCallback } from 'react';

const AUTH_USUARIO_CHAVE = 'mock_auth_usuario';
const AUTH_TIPO_CHAVE = 'mock_usuario_tipo';

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const usuarioAuthenticado = localStorage.getItem(AUTH_USUARIO_CHAVE);
    return usuarioAuthenticado ? JSON.parse(usuarioAuthenticado) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(AUTH_USUARIO_CHAVE, JSON.stringify(usuario));
      localStorage.setItem(AUTH_TIPO_CHAVE, usuario.tipo);
    } else {
      localStorage.removeItem(AUTH_USUARIO_CHAVE);
      localStorage.removeItem(AUTH_TIPO_CHAVE);
    }
  }, [usuario]);

  const login = useCallback((tipo: TipoUsuario) => {
    setUsuario(UsuarioMockado[tipo]);
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  const trocarTipo = useCallback((tipo: TipoUsuario) => {
    setUsuario(UsuarioMockado[tipo]);
  }, []);

  return { usuario, login, logout, trocarTipo };
}
