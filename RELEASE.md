# Release Checklist — Potinho

## Antes de cada build de produção

- [ ] Substituir App ID e unit IDs do AdMob em `app.json` e `src/services/adsService.ts` pelos IDs reais da conta de publisher.
- [ ] Configurar `EXPO_PUBLIC_SENTRY_DSN` no perfil de build de produção da EAS (`eas secret:create`).
- [ ] Hospedar `PRIVACY.md` publicamente e atualizar `PRIVACY_URL` em `app/settings.tsx`.
- [ ] Criar o produto `premium_unlock` (não-consumível) na Play Console, preço R$ 6,90.
- [ ] Substituir o placeholder Lottie em `assets/lottie/jar-shake.json` por uma animação final (LottieFiles ou encomenda).
- [ ] Adicionar um arquivo de som real em `assets/sounds/shake.mp3` (CC0 do freesound.org).
- [ ] Rodar `npm test` — todos os testes devem passar.
- [ ] Rodar `npx tsc --noEmit` — zero erros de tipo.
- [ ] Testar manualmente o checklist completo (abaixo).

## Checklist de testes manuais

- [ ] Primeira abertura: onboarding aparece, primeira tarefa é criada, home aparece.
- [ ] Adicionar, editar, deletar tarefa funciona.
- [ ] Sortear com 0 tarefas: botão desabilitado.
- [ ] Sortear com tarefas: animação, som, vibração, card da tarefa aparece.
- [ ] Marcar como concluída: tarefa sai da lista ativa, aparece no histórico, streak incrementa.
- [ ] "Fica pra depois": tarefa volta pro potinho.
- [ ] Streak: sorteio no mesmo dia não duplica; sorteio em dias consecutivos incrementa.
- [ ] Banner de anúncio aparece no modo grátis.
- [ ] Após 5 sorteios (não sendo o primeiro do dia), interstitial aparece.
- [ ] Compra via conta de teste Play Store ativa `isPremium`, some o banner, desbloqueia stats.
- [ ] Reinstalar app mantendo a conta Google: premium é restaurado automaticamente.
- [ ] Modo avião: app funciona normalmente.
- [ ] Rotação de tela e background/foreground: sem crash.
- [ ] Testar em 3 tamanhos (pequeno, médio, grande).
- [ ] Modo escuro funciona.

## Primeira publicação

1. `eas build --platform android --profile production`
2. Esperar build concluir.
3. `eas submit --platform android` → envia para track **Internal testing**.
4. Adicionar ao menos 12 testers ao Internal testing na Play Console.
5. Aguardar 14 dias (obrigatório pela Google desde 2023 para novas contas).
6. Promover o build para **Closed testing** → **Open testing** → **Production**.

## Pós-lançamento (primeiras 2 semanas)

- [ ] Monitorar crashes no Sentry diariamente.
- [ ] Ler e responder 100% das reviews na Play Store.
- [ ] Acompanhar métricas no Firebase Analytics: sessões, primeiro sorteio, paywall aberto, compra concluída.
- [ ] Calcular conversão grátis → premium após 14 dias.
- [ ] Iterar no paywall (copy, preço) antes de qualquer nova feature.
