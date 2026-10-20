# Git e permissões do ambiente

1. Antes de operações que modifiquem o repositório, identifique o estado atual do Git e preserve todas as alterações locais do usuário.
2. Se um comando Git falhar com `Operation not permitted` ou erro equivalente ao tentar escrever em `.git`, investigue se a causa é o sandbox antes de alterar permissões ou configurações.
3. Não repita indefinidamente um comando que já falhou pela mesma restrição.
4. Se houver evidências de que o sandbox está bloqueando uma operação legítima, solicite autorização para executar o comando no ambiente local, fora do sandbox, caso essa opção esteja disponível.
5. Aguarde a autorização exigida pelo ambiente antes de executar operações fora do sandbox. Nunca tente contornar o mecanismo de autorização.
6. Não use `sudo`, não altere propriedade ou permissões de arquivos e não modifique configurações globais sem identificar a necessidade e obter minha autorização.
7. Não execute `git reset --hard`, `git clean`, nem descarte ou sobrescreva alterações locais como tentativa de resolver problemas de permissão.
8. Não faça `git commit` ou `git push` sem minha autorização explícita.
9. Após corrigir um problema de permissão, valide o resultado com comandos seguros e informe o que foi alterado.
10. Se não for possível executar uma operação devido às restrições do ambiente, explique o bloqueio e solicite a autorização necessária. Não afirme que a operação foi concluída sem verificar o resultado.
