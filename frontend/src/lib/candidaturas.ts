const AUTH_TOKEN_CHAVE = 'auth_token';

export async function enviarCandidatura(trabalhoId: number) {
  const token = localStorage.getItem(AUTH_TOKEN_CHAVE);

  if (!token) {
    throw new Error('Faça login para se candidatar.');
  }

  const resposta = await fetch('/api/trabalhos/aplicacoes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      trabalho: trabalhoId,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados?.trabalho?.[0] ||
      dados?.detail ||
      'Nao foi possivel enviar a candidatura.'
    );
  }

  return dados;
}
