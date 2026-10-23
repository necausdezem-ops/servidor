# Caixa de Desejo

Sandbox FPS 3D para Windows, com desejos interpretados pelo Ollama local e um interpretador básico como fallback.

## Gerar o executável portátil
1. Abra **Actions**.
2. Selecione **Build Caixa de Desejo (.exe)** e clique em **Run workflow**.
3. Baixe o artefato **CaixaDeDesejo-exe**. Ele contém `CaixaDeDesejo.exe`.

O workflow também roda automaticamente a cada push em `main`.

## Jogar
- Instale o Ollama em https://ollama.com
- No terminal, rode `ollama pull llama3.2` (ou `ollama pull qwen2.5:3b`).
- Deixe o Ollama ativo e abra o executável.
- Controles: WASD, mouse, clique para atirar, Espaço para pular, M para abrir a Caixa de Desejo, 1–9 para trocar armas, F11 para tela cheia.

Sem Ollama, o jogo usa o interpretador básico. Para rodar pelo código-fonte: `npm install` e `npm start`.
