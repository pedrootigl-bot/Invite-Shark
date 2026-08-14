# Lacunas do Invite Shiver — Relatório para superiores

**Data:** 14/08/2026  
**Escopo:** Landing page de divulgação do programa Invite Shiver (Shiver Broker)  
**Objetivo deste documento:** listar lacunas visíveis para um usuário novo e para a operação do projeto, com prioridade de negócio.

---

## Veredito em uma frase

A página comunica bem “indicação + recompensa”, mas ainda não deixa óbvio **de quem é o programa**, **para quem é**, **o que se ganha de concreto** e **onde estão as regras oficiais** — pontos críticos para conversão e compliance.

---

## 1. Lacunas de clareza de produto (alta prioridade)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Pouca conexão imediata com a **Shiver Broker** | Usuário novo pode não entender que é campanha de uma corretora | No hero aparece “Invite Shiver”; “Shiver Broker” só fica claro no FAQ |
| Público-alvo indefinido no primeiro contato | Dúvida: “preciso já ser cliente?” | Elegibilidade aparece tarde |
| Benefício concreto fraco no primeiro viewport | Menos conversão | Headline genérica (“Convide amigos…”) sem valor numérico/principal no topo |
| CTA “Acessar” genérico | Usuário não sabe o próximo passo | Não diferencia login, cadastro ou painel do programa |
| Jargão interno cedo demais | Fricção cognitiva | “Trader qualificado”, “missões”, “indicação válida” sem contexto prévio suficiente |

**Recomendação:** reescrever hero + eyebrow + CTA com: marca mãe + para quem é + benefício principal + ação clara.

---

## 2. Lacunas de conteúdo e oferta (alta prioridade)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Valores e benefícios fragmentados | Usuário não monta a oferta mental completa | R$500, Risk Free US$15, VIP, viagem aparecem em partes diferentes |
| Critérios de qualificação incompletos na landing | Expectativa errada / suporte sobrecarregado | Depósito mínimo e “operações válidas” sem números oficiais |
| Missões sem metas numéricas | Cards perdem sentido de progresso | Textos “5 / 8 / 25 indicados” foram removidos |
| Ranking e progresso ilustrativos sem aviso forte o bastante | Risco de parecer dado real | Existe disclaimer, mas o visual parece produto ao vivo |
| Section de missões só no mobile | Experiência inconsistente desktop × mobile | Desktop não vê a seção; mobile vê |

**Recomendação:** definir com marketing/compliance um “pacote oficial de oferta” (o que pode ser prometido na landing) e espelhar isso no topo + em uma section única de benefícios.

---

## 3. Lacunas jurídicas / compliance (crítica)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Section **Termos, condições e riscos** removida | Menor transparência e risco regulatório | FAQ ainda cita “seção de termos desta página” |
| Links `#regulamento` e `#privacidade` sem destino real na página | Quebra de confiança + risco jurídico | Footer/FAQ apontam para âncoras inexistentes ou vazias |
| Regulamento oficial não linkado de forma clara | Usuário não consegue validar regras |
| Avisos de risco de investimento pouco evidentes | Exigência comum em produtos financeiros | Página incentiva indicação/operação sem disclaimer forte no fluxo principal |

**Recomendação:** restaurar bloco mínimo de termos/risco **ou** links oficiais externos (regulamento + privacidade), e alinhar textos do FAQ com o que realmente existe na página.

---

## 4. Lacunas de UX / conversão (média–alta)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Muitos CTAs “Acessar Invite Shiver” repetidos | Fadiga; pouco senso de jornada | Quase toda section termina com o mesmo botão |
| Fluxo das sections pouco didático | Usuário se perde no “como participar” | Benefício, progresso, qualificação e conquistas competem entre si |
| Nav “Missões” no desktop aponta para section oculta | Link morto / experiência quebrada | Section missões escondida no desktop |
| “Saiba mais” no navbar só leva a Como funciona | Pouco valor se o usuário já está no topo | Pode ser substituído por benefício
| Sem prova social real | Menos credibilidade | Ranking é ilustrativo; não há depoimentos/números oficiais |

**Recomendação:** mapear jornada mínima: Entender → Ver benefício → Ver regras → Entrar na plataforma.

---

## 5. Lacunas técnicas / SEO / operação (média)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Sem `meta description` / Open Graph | Pior compartilhamento e SEO | Title existe; preview social fraco |
| Landing 100% estática, sem analytics aparente no código | Difícil medir conversão | Não há evidência clara de GA/GTM/Pixel no frontend revisado |
| Sem ambiente de staging / checklist de aceite documentado no repo | Risco de publicar inconsistências | README descreve o projeto, mas falta matriz de aceite negócio×legal |
| Dependência total do destino `shiverbroker.com` | Se a plataforma não continuar a jornada, a landing “morre” | Landing só divulga; operação é externa |

**Recomendação:** incluir meta tags, tracking de CTA e um checklist de go-live assinado por Marketing + Legal + Produto.

---

## 6. Lacunas de consistência de experiência (média)

| Lacuna | Impacto | Observação |
|--------|---------|------------|
| Desktop e mobile contam histórias diferentes | Mensagem fragmentada | Missões só mobile; recompensas do painel conquistas ocultas no mobile |
| Nome/marca: Invite Shiver × Shiver Broker | Possível confusão de marca | Logo/nome do programa vs empresa |

---

## Priorização sugerida para os superiores

### P0 — Antes de qualquer divulgação ampla
1. Deixar explícito no hero: Shiver Broker + elegibilidade + benefício principal  

### P1 — Para melhorar conversão
4. Pacote único de benefícios com valores aprovados  
5. Critérios mínimos de “indicação válida” com números oficiais (se puderem ser públicos)  
6. Revisar CTAs e ordem das sections  

### P2 — Para operação contínua
7. SEO + Open Graph + analytics nos CTAs  
8. Unificar experiência desktop/mobile (ou justificar diferenças)  
9. Documento de aceite (Marketing / Legal / Produto) em `/documents`

---

## Perguntas que os superiores precisam responder para destravar

1. Qual é a **promessa oficial** que a landing pode fazer (valores, prazos, condições)?  
2. O programa é **só para clientes ativos** da Shiver Broker?  
3. Onde fica o **regulamento oficial** (URL canônica)?  
4. O botão “Acessar” deve ir para **login, cadastro ou painel do Invite**?  
5. Ranking, missões e progresso podem continuar **ilustrativos**, ou precisam refletir dados reais?

---

## Conclusão

O projeto visualmente está maduro para uma landing de marketing. As maiores lacunas não são de “beleza”, e sim de **clareza de proposta**, **consistência desktop/mobile**, **compliance** e **fechamento da jornada até a plataforma**. Fechar P0 reduz risco reputacional/jurídico; fechar P1 tende a aumentar conversão com o mesmo design.
