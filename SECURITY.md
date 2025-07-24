# Política de Segurança

## Versões Suportadas

Use esta seção para informar às pessoas sobre quais versões do seu projeto estão atualmente sendo suportadas com atualizações de segurança.

| Versão | Suportada          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Relatando uma Vulnerabilidade

A segurança do Route Atlas é levada a sério. Se você descobrir uma vulnerabilidade de segurança, agradecemos seus esforços e investigação responsável.

### Como Relatar

**NÃO** crie uma issue pública para vulnerabilidades de segurança.

Em vez disso, envie um e-mail para **seskelsen@gmail.com** com os seguintes detalhes:

- Descrição da vulnerabilidade
- Passos para reproduzir ou prova de conceito
- Versões afetadas
- Possível impacto
- Sugestão de correção (se houver)

### O Que Esperar

1. **Confirmação**: Reconheceremos o recebimento do seu relatório dentro de 48 horas
2. **Investigação**: Investigaremos e validaremos a vulnerabilidade
3. **Correção**: Desenvolveremos e testaremos uma correção
4. **Divulgação**: Coordenaremos a divulgação responsável

### Cronograma de Resposta

- **48 horas**: Confirmação do recebimento
- **7 dias**: Validação inicial e plano de correção
- **30 dias**: Implementação da correção (para vulnerabilidades críticas)
- **90 dias**: Divulgação pública coordenada

### Recompensas

Embora não tenhamos um programa formal de bug bounty, reconhecemos e agradecemos publicamente os pesquisadores de segurança responsáveis (com permissão).

### Escopo

Esta política se aplica a:

- O código-fonte principal do Route Atlas
- Dependências diretas do projeto
- Configurações de deployment recomendadas

### Fora do Escopo

- Ataques que requerem acesso físico ao dispositivo
- Vulnerabilidades em dependências de terceiros que não afetam diretamente o Route Atlas
- Issues reportados através de ferramentas automatizadas sem validação manual

### Divulgação Responsável

Pedimos que você:

- Nos dê tempo razoável para investigar e corrigir issues antes da divulgação pública
- Não acesse, modifique ou exclua dados de outros usuários
- Não execute ataques que possam prejudicar a disponibilidade do serviço
- Não viole leis ou regulamentos locais

### Tipos de Vulnerabilidades de Interesse

Estamos particularmente interessados em:

- **Injeção de Código**: XSS, SQL injection, command injection
- **Problemas de Autenticação**: Bypass de autenticação, escalação de privilégios
- **Exposição de Dados**: Acesso não autorizado a dados sensíveis
- **Vulnerabilidades de Upload**: Upload de arquivos maliciosos
- **Configurações Inseguras**: Configurações padrão inseguras

### Recursos de Segurança

Para mais informações sobre práticas de segurança:

- [Guia de Configuração Segura](docs/CONFIGURATION.md)
- [Práticas de Deploy Seguro](docs/DEPLOYMENT.md)
- [Documentação da API](docs/API.md)

### Contato

- **Email de Segurança**: seskelsen@gmail.com
- **Chave PGP**: [Disponível mediante solicitação]

### Histórico de Atualizações

- **2024-01**: Política inicial de segurança estabelecida

---

Agradecemos sua ajuda para manter o Route Atlas seguro!