export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, tipo, mensagem } = req.body;

  if (!nome || !tipo || !mensagem) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const prompt = `Gere um contrato jurídico completo de ${tipo}.
Contratante: ${nome}.
Detalhes adicionais: ${mensagem}.
Use linguagem formal e estrutura profissional.`;

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente jurídico especialista em contratos." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const json = await resposta.json();

    if (json.error) {
      return res.status(500).json({ error: json.error.message });
    }

    return res.status(200).json({ contrato: json.choices[0].message.content });
  } catch (erro) {
    return res.status(500).json({ error: "Erro ao acessar a OpenAI: " + erro.message });
  }
}
