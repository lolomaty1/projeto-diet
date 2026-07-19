/* ========================================
   Lo Diet — Dietas Recomendadas Templates
   7 dias completos para cada objetivo
   ======================================== */

const DIET_TEMPLATES = {

    // ═══════════════════════════════════════
    // 🔥 EMAGRECIMENTO — ~1400-1600 kcal/dia
    // ═══════════════════════════════════════
    emagrecimento: {
        id: 'emagrecimento',
        name: 'Emagrecimento',
        icon: '🔥',
        color: '#ef4444',
        colorBg: 'rgba(239,68,68,0.08)',
        description: 'Dieta hipocalórica equilibrada com foco em alimentos de alta saciedade, ricos em fibras e proteínas. Déficit calórico moderado para perda de peso saudável e sustentável.',
        dailyCal: '1400–1600 kcal',
        macroSplit: '35% Proteína | 40% Carboidrato | 25% Gordura',
        tips: [
            'Beber ao menos 2L de água por dia',
            'Evitar alimentos ultraprocessados e açúcar refinado',
            'Priorizar proteínas magras em todas as refeições',
            'Mastigar devagar e fazer refeições sem distrações',
        ],
        days: {
            seg: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: '2 ovos mexidos com tomate e orégano\n1 fatia de pão integral\n1 xícara de chá verde sem açúcar', calorias: 280, proteinas: 18, carboidratos: 22, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 maçã verde\n10 castanhas-de-caju', calorias: 150, proteinas: 4, carboidratos: 18, gorduras: 8 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '120g de peito de frango grelhado\n3 colheres de arroz integral\n2 colheres de feijão\nSalada de alface, tomate, pepino e cenoura ralada\n1 colher de azeite de oliva', calorias: 420, proteinas: 35, carboidratos: 42, gorduras: 12 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 iogurte natural desnatado\n1 colher de sopa de chia\n5 morangos', calorias: 130, proteinas: 8, carboidratos: 14, gorduras: 5 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '150g de filé de tilápia assada\nPurê de abóbora (3 colheres)\nBrócolis refogado com alho\nSalada de rúcula', calorias: 320, proteinas: 30, carboidratos: 22, gorduras: 10 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de camomila\n1 fatia de queijo branco (30g)', calorias: 70, proteinas: 6, carboidratos: 1, gorduras: 5 },
            ],
            ter: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: '1 tapioca pequena com queijo cottage e tomate\n1 xícara de café com leite desnatado', calorias: 250, proteinas: 14, carboidratos: 28, gorduras: 8 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 pera\n1 colher de sopa de pasta de amendoim', calorias: 170, proteinas: 5, carboidratos: 20, gorduras: 9 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '130g de patinho moído refogado\n3 colheres de arroz integral\n2 colheres de lentilha\nAbobrinha grelhada\nSalada de repolho e cenoura', calorias: 430, proteinas: 34, carboidratos: 40, gorduras: 14 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 banana prata\n1 colher de aveia em flocos', calorias: 140, proteinas: 3, carboidratos: 28, gorduras: 2 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Omelete com 2 ovos, espinafre e cogumelos\n1 fatia de pão integral\nSalada verde com azeite', calorias: 310, proteinas: 22, carboidratos: 18, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de erva-cidreira\n2 cookies integrais pequenos', calorias: 80, proteinas: 2, carboidratos: 14, gorduras: 2 },
            ],
            qua: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Smoothie: 200ml leite desnatado, 1 banana, 1 colher de cacau em pó, 1 colher de aveia', calorias: 260, proteinas: 12, carboidratos: 38, gorduras: 6 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 fatia de melão\n5 amêndoas', calorias: 110, proteinas: 3, carboidratos: 14, gorduras: 5 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '120g de salmão grelhado\n3 colheres de quinoa\nVagem refogada com alho\nSalada de folhas verdes, tomate cereja e cebola roxa', calorias: 440, proteinas: 32, carboidratos: 35, gorduras: 18 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 iogurte grego zero açúcar\n1 colher de granola sem açúcar', calorias: 140, proteinas: 10, carboidratos: 12, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Sopa de legumes com frango desfiado (abobrinha, cenoura, chuchu, frango)\n1 torrada integral', calorias: 280, proteinas: 24, carboidratos: 26, gorduras: 8 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá verde\n1 colher de sopa de cottage', calorias: 50, proteinas: 5, carboidratos: 2, gorduras: 2 },
            ],
            qui: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: '1 fatia de pão integral com ricota e geleia diet\n1 xícara de café preto\n1 fatia de mamão', calorias: 230, proteinas: 10, carboidratos: 32, gorduras: 6 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: 'Mix: 1 maçã picada + 1 colher de linhaça + canela', calorias: 120, proteinas: 3, carboidratos: 18, gorduras: 4 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '130g de peito de frango ao limão\n3 colheres de arroz integral\n2 colheres de grão-de-bico\nCouve refogada\nSalada de beterraba ralada', calorias: 440, proteinas: 36, carboidratos: 44, gorduras: 12 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 ovo cozido\n1 cenoura baby in natura', calorias: 110, proteinas: 8, carboidratos: 6, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Salada completa: folhas verdes, atum em lata (light), ovo cozido, tomate, pepino\nMolho de limão e azeite', calorias: 330, proteinas: 28, carboidratos: 12, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '200ml de leite morno desnatado com canela', calorias: 70, proteinas: 6, carboidratos: 10, gorduras: 0 },
            ],
            sex: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Panqueca de banana: 1 banana amassada + 1 ovo + 1 colher de aveia\n1 xícara de chá verde', calorias: 240, proteinas: 12, carboidratos: 30, gorduras: 8 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 tangerina\n8 castanhas-do-pará (2 unidades)', calorias: 130, proteinas: 3, carboidratos: 16, gorduras: 6 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '120g de carne moída refogada (patinho)\n3 colheres de batata-doce cozida\n2 colheres de feijão preto\nCouve-flor gratinada light\nSalada de alface e tomate', calorias: 440, proteinas: 32, carboidratos: 44, gorduras: 14 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Vitamina: 200ml leite desnatado + ½ banana + 1 colher de cacau', calorias: 150, proteinas: 8, carboidratos: 22, gorduras: 3 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '150g de peixe branco grelhado\nPurê de mandioquinha (3 colheres)\nEspinafre refogado\nSalada de rúcula e tomate', calorias: 310, proteinas: 30, carboidratos: 24, gorduras: 10 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de camomila\n2 torradas integrais com queijo branco', calorias: 100, proteinas: 6, carboidratos: 12, gorduras: 3 },
            ],
            sab: [
                { tipo: '☀️ Café da Manhã', horario: '08:00', alimentos: 'Crepioca (1 ovo + 1 colher de goma de tapioca) com queijo branco e tomate\n1 xícara de café com leite desnatado\n½ mamão papaia', calorias: 290, proteinas: 16, carboidratos: 30, gorduras: 10 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: 'Mix de frutas: morango, kiwi e uva (1 xícara)', calorias: 90, proteinas: 2, carboidratos: 20, gorduras: 1 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: '130g de frango desfiado ao molho de tomate caseiro\n3 colheres de arroz integral\n2 colheres de feijão carioca\nCenoura e chuchu cozidos\nSalada mista', calorias: 430, proteinas: 34, carboidratos: 42, gorduras: 12 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: '1 fatia de bolo integral de cenoura (sem cobertura)\n1 xícara de chá', calorias: 160, proteinas: 4, carboidratos: 24, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: 'Wrap integral: 1 tortilha + frango desfiado + alface + tomate + cenoura ralada + iogurte natural', calorias: 310, proteinas: 24, carboidratos: 28, gorduras: 10 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 copo de água de coco natural (200ml)', calorias: 45, proteinas: 0, carboidratos: 10, gorduras: 0 },
            ],
            dom: [
                { tipo: '☀️ Café da Manhã', horario: '08:30', alimentos: '2 fatias de pão integral com pasta de abacate e ovo pochê\n1 xícara de café preto\n1 fatia de melão', calorias: 310, proteinas: 16, carboidratos: 28, gorduras: 14 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: '1 iogurte natural desnatado com mel (1 colher de chá) e chia', calorias: 130, proteinas: 8, carboidratos: 16, gorduras: 4 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: '130g de coxão mole assado\n3 colheres de arroz integral\n2 colheres de feijão\nAbobrinha recheada com ricota\nSalada de folhas com limão', calorias: 450, proteinas: 36, carboidratos: 40, gorduras: 14 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: '1 banana com 1 colher de pasta de amendoim', calorias: 180, proteinas: 6, carboidratos: 22, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Sopa creme de abóbora com gengibre\n1 filé de frango grelhado (100g)\n1 torrada integral', calorias: 280, proteinas: 26, carboidratos: 24, gorduras: 8 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de erva-doce\n1 fatia fina de queijo minas', calorias: 60, proteinas: 5, carboidratos: 1, gorduras: 4 },
            ]
        }
    },

    // ═══════════════════════════════════════
    // 💪 GANHO DE MASSA — ~2800-3200 kcal/dia
    // ═══════════════════════════════════════
    ganho_massa: {
        id: 'ganho_massa',
        name: 'Ganho de Massa Muscular',
        icon: '💪',
        color: '#3b82f6',
        colorBg: 'rgba(59,130,246,0.08)',
        description: 'Dieta hipercalórica com alto teor proteico para hipertrofia muscular. Foco em proteínas de alto valor biológico, carboidratos complexos e gorduras boas para maximizar o ganho muscular.',
        dailyCal: '2800–3200 kcal',
        macroSplit: '30% Proteína | 50% Carboidrato | 20% Gordura',
        tips: [
            'Consumir proteína a cada 3 horas',
            'Não pular o pós-treino — janela anabólica',
            'Priorizar carboidratos complexos (batata-doce, arroz integral, aveia)',
            'Dormir ao menos 7-8 horas para recuperação muscular',
        ],
        days: {
            seg: [
                { tipo: '☀️ Café da Manhã', horario: '06:30', alimentos: '4 claras + 2 ovos inteiros mexidos\n2 fatias de pão integral com manteiga\n1 banana com aveia (2 colheres)\n200ml de suco de laranja natural', calorias: 580, proteinas: 36, carboidratos: 62, gorduras: 18 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:30', alimentos: 'Vitamina hipercalórica: 300ml leite integral, 1 banana, 2 colheres de aveia, 1 colher de pasta de amendoim, 1 colher de mel', calorias: 480, proteinas: 18, carboidratos: 62, gorduras: 18 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '200g de peito de frango grelhado\n5 colheres de arroz integral\n3 colheres de feijão\n2 colheres de batata-doce\nSalada de alface, tomate e cenoura\n1 colher de azeite', calorias: 680, proteinas: 50, carboidratos: 78, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '2 fatias de pão integral com frango desfiado e queijo\n1 banana\n200ml de suco natural', calorias: 420, proteinas: 28, carboidratos: 52, gorduras: 10 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '200g de carne vermelha magra grelhada (maminha)\n4 colheres de arroz integral\nBatata-doce assada (150g)\nBrócolis e cenoura refogados\nSalada verde', calorias: 650, proteinas: 48, carboidratos: 68, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: '1 copo de leite integral (250ml)\n2 colheres de aveia\n1 colher de mel\n1 colher de pasta de amendoim', calorias: 380, proteinas: 14, carboidratos: 42, gorduras: 16 },
            ],
            ter: [
                { tipo: '☀️ Café da Manhã', horario: '06:30', alimentos: 'Panqueca proteica: 3 ovos + 3 colheres de aveia + 1 banana\nCobertura de mel e canela\n200ml de leite integral', calorias: 550, proteinas: 28, carboidratos: 64, gorduras: 18 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:30', alimentos: '1 sanduíche: pão integral, peito de peru, queijo muçarela, alface\n1 maçã', calorias: 380, proteinas: 22, carboidratos: 42, gorduras: 12 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '200g de filé de tilápia grelhada\n5 colheres de macarrão integral\nMolho de tomate caseiro\nLegumes salteados (abobrinha, pimentão, cebola)\nSalada com azeite', calorias: 640, proteinas: 46, carboidratos: 72, gorduras: 14 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Açaí (200ml) com granola e banana\n1 colher de whey ou leite em pó', calorias: 450, proteinas: 16, carboidratos: 68, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '200g de frango ao forno com ervas\n4 colheres de arroz integral\n3 colheres de feijão\nPurê de mandioquinha\nSalada mista', calorias: 680, proteinas: 50, carboidratos: 74, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Mingau de aveia: 250ml leite, 3 colheres de aveia, 1 banana amassada, canela', calorias: 380, proteinas: 14, carboidratos: 56, gorduras: 10 },
            ],
            qua: [
                { tipo: '☀️ Café da Manhã', horario: '06:30', alimentos: 'Tapioca grande com 2 ovos mexidos, queijo e presunto\n1 copo de vitamina de banana com leite integral e aveia', calorias: 580, proteinas: 30, carboidratos: 58, gorduras: 22 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:30', alimentos: '2 fatias de pão de forma integral com pasta de amendoim e banana fatiada\n200ml de suco de uva integral', calorias: 440, proteinas: 14, carboidratos: 62, gorduras: 16 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '200g de contra-filé grelhado\n5 colheres de arroz branco\n3 colheres de feijão preto\nMandioca cozida (100g)\nSalada de repolho e cenoura\nFarofa de ovos (2 colheres)', calorias: 740, proteinas: 52, carboidratos: 80, gorduras: 20 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Wrap integral com atum, alface e tomate\n1 banana\n200ml de leite', calorias: 420, proteinas: 28, carboidratos: 46, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Omelete com 4 ovos, queijo, presunto e tomate\n4 colheres de arroz integral\nBatata-doce assada (150g)\nSalada verde com azeite', calorias: 660, proteinas: 40, carboidratos: 62, gorduras: 26 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: '2 fatias de pão integral com queijo branco\n1 copo de leite com achocolatado', calorias: 350, proteinas: 16, carboidratos: 44, gorduras: 12 },
            ],
            qui: [
                { tipo: '☀️ Café da Manhã', horario: '06:30', alimentos: '3 ovos mexidos com queijo\n2 fatias de pão integral com manteiga\n1 mamão (½ unidade)\n200ml de café com leite integral', calorias: 560, proteinas: 28, carboidratos: 50, gorduras: 24 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:30', alimentos: 'Shake: 300ml de leite, 2 colheres de aveia, 1 colher de cacau, 1 banana, 1 colher de mel', calorias: 460, proteinas: 16, carboidratos: 68, gorduras: 12 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '200g de coxa e sobrecoxa de frango sem pele\n5 colheres de arroz integral\n3 colheres de lentilha\nAbóbora assada\nSalada de beterraba e alface', calorias: 680, proteinas: 48, carboidratos: 76, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Tapioca com frango desfiado e requeijão\n1 suco de maracujá natural', calorias: 400, proteinas: 24, carboidratos: 50, gorduras: 10 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '200g de carne moída refogada\nPurê de batata (4 colheres)\nVagem refogada\nArroz integral (3 colheres)\nSalada com azeite', calorias: 660, proteinas: 46, carboidratos: 64, gorduras: 22 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Iogurte integral com granola, mel e banana fatiada', calorias: 380, proteinas: 12, carboidratos: 54, gorduras: 12 },
            ],
            sex: [
                { tipo: '☀️ Café da Manhã', horario: '06:30', alimentos: 'Pão francês (2 unidades) com queijo muçarela e presunto\n2 ovos cozidos\n200ml de suco de laranja', calorias: 580, proteinas: 32, carboidratos: 56, gorduras: 22 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:30', alimentos: 'Vitamina de abacate: ½ abacate, 250ml leite, 1 colher de mel, 1 colher de aveia', calorias: 440, proteinas: 12, carboidratos: 42, gorduras: 24 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '200g de salmão grelhado\n5 colheres de arroz integral\nBatata-doce (150g)\nBrócolis gratinado\nSalada de folhas com azeite e limão', calorias: 720, proteinas: 50, carboidratos: 72, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Sanduíche natural: pão integral, peito de peru, queijo branco, alface, tomate\n1 banana com aveia', calorias: 430, proteinas: 24, carboidratos: 54, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '200g de peito de frango empanado ao forno (farinha de aveia)\n4 colheres de arroz\nFeijão tropeiro (3 colheres)\nCouve refogada\nSalada', calorias: 700, proteinas: 48, carboidratos: 74, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Tapioca com banana e canela\n1 copo de leite integral', calorias: 360, proteinas: 10, carboidratos: 52, gorduras: 12 },
            ],
            sab: [
                { tipo: '☀️ Café da Manhã', horario: '07:30', alimentos: 'Panqueca proteica: 3 ovos, 3 colheres de aveia, 1 banana\n2 colheres de mel\n200ml de leite com café', calorias: 560, proteinas: 28, carboidratos: 68, gorduras: 16 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: 'Açaí na tigela (250ml) com banana, granola e mel', calorias: 480, proteinas: 8, carboidratos: 78, gorduras: 14 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Feijoada light: feijão preto, carne seca, lombo, couve\nArroz branco (5 colheres)\nFarofa de ovos\nLaranja (2 fatias)', calorias: 750, proteinas: 46, carboidratos: 80, gorduras: 24 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Torrada integral (3 unidades) com requeijão e peito de peru\n200ml de suco natural', calorias: 380, proteinas: 18, carboidratos: 48, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: '200g de hambúrguer artesanal de carne magra\nPão integral\nQueijo, alface, tomate\nBatata-doce frita ao forno', calorias: 680, proteinas: 44, carboidratos: 60, gorduras: 26 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Mingau de aveia com leite integral, banana e canela', calorias: 350, proteinas: 12, carboidratos: 50, gorduras: 10 },
            ],
            dom: [
                { tipo: '☀️ Café da Manhã', horario: '08:00', alimentos: 'Pão de queijo (3 unidades)\n3 ovos mexidos\n200ml de suco de acerola\n1 fatia de mamão', calorias: 560, proteinas: 26, carboidratos: 52, gorduras: 24 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: 'Shake de morango: 250ml leite, morangos, 1 colher de mel, 2 colheres de aveia', calorias: 380, proteinas: 14, carboidratos: 56, gorduras: 10 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Macarronada: 200g de macarrão integral com molho bolonhesa (150g de carne)\nQueijo parmesão ralado\nSalada com azeite', calorias: 720, proteinas: 42, carboidratos: 82, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Tapioca grande com queijo e presunto\n1 banana com mel', calorias: 420, proteinas: 18, carboidratos: 58, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '200g de peito de frango recheado com queijo e tomate seco\nArroz integral (4 colheres)\nPurê de batata\nLegumes grelhados', calorias: 680, proteinas: 50, carboidratos: 64, gorduras: 22 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: '2 fatias de pão integral com manteiga de amendoim\n1 copo de leite integral', calorias: 400, proteinas: 16, carboidratos: 42, gorduras: 18 },
            ]
        }
    },

    // ═══════════════════════════════════════
    // ⚖️ MANUTENÇÃO — ~2000-2200 kcal/dia
    // ═══════════════════════════════════════
    manutencao: {
        id: 'manutencao',
        name: 'Manutenção de Peso',
        icon: '⚖️',
        color: '#10b981',
        colorBg: 'rgba(16,185,129,0.08)',
        description: 'Dieta equilibrada para manutenção do peso corporal. Balanço calórico neutro com distribuição adequada de macronutrientes, priorizando alimentos naturais e variados.',
        dailyCal: '2000–2200 kcal',
        macroSplit: '25% Proteína | 50% Carboidrato | 25% Gordura',
        tips: [
            'Manter horários regulares para as refeições',
            'Variar as fontes de proteína ao longo da semana',
            'Incluir pelo menos 5 porções de frutas e vegetais por dia',
            'Praticar atividade física regular para manter a composição corporal',
        ],
        days: {
            seg: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: '2 fatias de pão integral com queijo branco e presunto\n1 xícara de café com leite\n1 banana', calorias: 380, proteinas: 18, carboidratos: 48, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 maçã\n1 iogurte natural', calorias: 160, proteinas: 6, carboidratos: 24, gorduras: 4 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de frango grelhado\n4 colheres de arroz\n3 colheres de feijão\nSalada variada\n1 colher de azeite', calorias: 520, proteinas: 38, carboidratos: 56, gorduras: 14 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 fatia de bolo simples\n1 xícara de chá', calorias: 200, proteinas: 4, carboidratos: 30, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: '150g de peixe assado\nPurê de batata (3 colheres)\nLegumes refogados\nSalada de folhas', calorias: 420, proteinas: 32, carboidratos: 38, gorduras: 14 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 copo de leite com achocolatado\n3 biscoitos integrais', calorias: 200, proteinas: 8, carboidratos: 28, gorduras: 6 },
            ],
            ter: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Tapioca com queijo e tomate\n1 xícara de café com leite\n½ mamão papaia', calorias: 360, proteinas: 14, carboidratos: 46, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 barra de cereal integral\n1 pera', calorias: 170, proteinas: 3, carboidratos: 30, gorduras: 5 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de carne bovina refogada\n4 colheres de arroz integral\n2 colheres de lentilha\nAbobrinha grelhada\nSalada com tomate e cebola', calorias: 530, proteinas: 36, carboidratos: 54, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Vitamina: leite, banana, aveia e mel', calorias: 240, proteinas: 10, carboidratos: 36, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Omelete com 3 ovos, presunto, queijo e tomate\n2 fatias de pão integral\nSalada verde', calorias: 420, proteinas: 28, carboidratos: 30, gorduras: 20 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 iogurte com granola', calorias: 180, proteinas: 8, carboidratos: 24, gorduras: 6 },
            ],
            qua: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Pão francês com manteiga\n2 ovos cozidos\n1 xícara de café\n1 laranja', calorias: 380, proteinas: 18, carboidratos: 40, gorduras: 16 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 fatia de melão\n10 amêndoas', calorias: 160, proteinas: 5, carboidratos: 16, gorduras: 9 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de filé de frango ao forno\n4 colheres de arroz\n3 colheres de feijão preto\nCouve refogada\nSalada de beterraba', calorias: 520, proteinas: 38, carboidratos: 54, gorduras: 12 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 sanduíche natural de atum\n1 suco de maracujá', calorias: 260, proteinas: 16, carboidratos: 30, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Sopa de legumes com macarrão e frango desfiado\n1 torrada integral com queijo', calorias: 380, proteinas: 26, carboidratos: 40, gorduras: 12 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá\n2 torradas com geleia', calorias: 120, proteinas: 2, carboidratos: 22, gorduras: 3 },
            ],
            qui: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Mingau de aveia com banana e canela\n200ml de leite\n1 fatia de queijo', calorias: 370, proteinas: 16, carboidratos: 48, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 banana com pasta de amendoim (1 colher)', calorias: 180, proteinas: 5, carboidratos: 24, gorduras: 8 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de salmão grelhado\n4 colheres de arroz integral\nFeijão branco (2 colheres)\nVagem refogada\nSalada mista com azeite', calorias: 560, proteinas: 38, carboidratos: 50, gorduras: 20 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Iogurte grego com mel e frutas vermelhas', calorias: 200, proteinas: 12, carboidratos: 26, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Escondidinho de frango com purê de mandioquinha\nSalada de alface, tomate e pepino', calorias: 420, proteinas: 30, carboidratos: 40, gorduras: 14 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 copo de leite morno\n2 cookies integrais', calorias: 180, proteinas: 8, carboidratos: 22, gorduras: 6 },
            ],
            sex: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Crepioca com queijo cottage e ervas\n1 xícara de café com leite\n1 fatia de mamão', calorias: 340, proteinas: 18, carboidratos: 38, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: 'Mix de castanhas (30g)\n1 tangerina', calorias: 200, proteinas: 5, carboidratos: 16, gorduras: 13 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de carne de panela\n4 colheres de arroz\n3 colheres de feijão\nCenoura e batata cozidas\nSalada verde', calorias: 540, proteinas: 36, carboidratos: 56, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 fatia de pão integral com abacate amassado e tomate\n1 xícara de chá', calorias: 220, proteinas: 6, carboidratos: 22, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Pizza caseira integral: muçarela, tomate, manjericão (2 fatias)\nSalada de rúcula', calorias: 440, proteinas: 22, carboidratos: 46, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 iogurte natural com chia e mel', calorias: 150, proteinas: 8, carboidratos: 18, gorduras: 5 },
            ],
            sab: [
                { tipo: '☀️ Café da Manhã', horario: '08:00', alimentos: 'Pão de queijo (3 unidades)\n1 ovo cozido\n1 xícara de café com leite\n1 fatia de melão', calorias: 400, proteinas: 18, carboidratos: 42, gorduras: 18 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: 'Salada de frutas com granola (1 xícara)', calorias: 180, proteinas: 4, carboidratos: 34, gorduras: 4 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Strogonoff de frango\n4 colheres de arroz\nBatata palha assada\nSalada mista', calorias: 560, proteinas: 34, carboidratos: 58, gorduras: 18 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: '1 coxinha de frango assada (pequena)\n1 suco natural', calorias: 260, proteinas: 12, carboidratos: 28, gorduras: 10 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: 'Sanduíche: pão integral, hambúrguer caseiro, queijo, alface, tomate\nBatata-doce no forno', calorias: 480, proteinas: 30, carboidratos: 46, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 copo de água de coco\n1 fatia de queijo minas', calorias: 120, proteinas: 6, carboidratos: 14, gorduras: 4 },
            ],
            dom: [
                { tipo: '☀️ Café da Manhã', horario: '08:30', alimentos: 'Waffle integral com mel e frutas\n1 xícara de café com leite\n1 fatia de mamão', calorias: 400, proteinas: 12, carboidratos: 56, gorduras: 14 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: '1 maçã assada com canela e aveia', calorias: 140, proteinas: 3, carboidratos: 26, gorduras: 3 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Lasanha de berinjela com carne moída e queijo\nSalada de folhas com tomate cereja\nArroz (2 colheres)', calorias: 520, proteinas: 32, carboidratos: 44, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Smoothie de frutas vermelhas com iogurte e mel', calorias: 200, proteinas: 8, carboidratos: 32, gorduras: 4 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Risoto de cogumelos com frango\nSalada verde com azeite', calorias: 460, proteinas: 28, carboidratos: 52, gorduras: 14 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de camomila\n2 biscoitos amanteigados', calorias: 120, proteinas: 2, carboidratos: 18, gorduras: 5 },
            ]
        }
    },

    // ═══════════════════════════════════════
    // 🫀 SAÚDE GERAL — ~1800-2000 kcal/dia
    // ═══════════════════════════════════════
    saude_geral: {
        id: 'saude_geral',
        name: 'Saúde Geral',
        icon: '🫀',
        color: '#8b5cf6',
        colorBg: 'rgba(139,92,246,0.08)',
        description: 'Dieta inspirada no padrão mediterrâneo, focada na prevenção de doenças crônicas. Rica em fibras, antioxidantes, gorduras boas (azeite, peixes) e alimentos minimamente processados.',
        dailyCal: '1800–2000 kcal',
        macroSplit: '20% Proteína | 50% Carboidrato | 30% Gordura (boas)',
        tips: [
            'Priorizar gorduras insaturadas: azeite, castanhas, abacate, peixes',
            'Consumir peixes ricos em ômega-3 ao menos 2x por semana',
            'Incluir alimentos ricos em fibras para saúde intestinal',
            'Reduzir sódio — temperar com ervas e especiarias naturais',
        ],
        days: {
            seg: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Aveia com frutas vermelhas e chia (morango, mirtilo)\n1 xícara de chá verde\n1 fatia de pão integral com azeite', calorias: 340, proteinas: 12, carboidratos: 46, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 punhado de nozes (30g)\n1 kiwi', calorias: 230, proteinas: 6, carboidratos: 16, gorduras: 16 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de salmão assado com ervas\n3 colheres de arroz integral\nGrão-de-bico refogado (3 colheres)\nSalada mediterrânea: tomate, pepino, cebola roxa, azeitonas\nAzeite extra virgem', calorias: 520, proteinas: 36, carboidratos: 42, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 iogurte natural com mel e sementes de linhaça\n3 damascos secos', calorias: 180, proteinas: 8, carboidratos: 24, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Peito de frango ao limão com alecrim\nQuinoa (3 colheres)\nLegumes assados: berinjela, pimentão, abobrinha\nAzeite de oliva', calorias: 430, proteinas: 32, carboidratos: 36, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de camomila\n1 fatia de queijo minas com orégano', calorias: 80, proteinas: 6, carboidratos: 2, gorduras: 5 },
            ],
            ter: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Torrada integral com pasta de abacate, tomate cereja e azeite\n1 ovo cozido\n1 xícara de café sem açúcar', calorias: 340, proteinas: 14, carboidratos: 28, gorduras: 18 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 maçã\n1 colher de sopa de tahine', calorias: 180, proteinas: 4, carboidratos: 20, gorduras: 10 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: 'Salada completa: folhas, atum fresco grelhado (150g), tomate seco, alcaparras, ovo cozido\nPão integral (1 fatia)\nAzeite extra virgem', calorias: 480, proteinas: 38, carboidratos: 28, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Smoothie verde: couve, maçã, gengibre, limão, hortelã\n1 punhado de castanha-do-pará (3 unidades)', calorias: 160, proteinas: 4, carboidratos: 20, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Sopa de lentilha com legumes e cúrcuma\n1 fatia de pão integral com azeite\nSalada de rúcula com limão', calorias: 380, proteinas: 22, carboidratos: 44, gorduras: 12 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de ervas\n4 morangos', calorias: 30, proteinas: 1, carboidratos: 6, gorduras: 0 },
            ],
            qua: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Granola caseira com iogurte natural e frutas picadas\n1 xícara de chá verde', calorias: 320, proteinas: 12, carboidratos: 42, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 banana\nMix de sementes (girassol, abóbora) — 2 colheres', calorias: 200, proteinas: 6, carboidratos: 24, gorduras: 10 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de filé de peixe branco ao forno com tomate e cebola\n3 colheres de arroz integral\nFeijão branco (3 colheres)\nBrócolis e cenoura no vapor\nAzeite', calorias: 490, proteinas: 34, carboidratos: 48, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Hummus (3 colheres) com palitos de cenoura e pepino', calorias: 150, proteinas: 6, carboidratos: 14, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Frango ao curry com leite de coco\nArroz integral (3 colheres)\nSalada de folhas com manga e castanhas', calorias: 460, proteinas: 30, carboidratos: 40, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de leite morno com cúrcuma e canela (golden milk)', calorias: 90, proteinas: 4, carboidratos: 10, gorduras: 4 },
            ],
            qui: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: '2 ovos pochê sobre pão integral com espinafre\n1 xícara de café\n1 fatia de melão', calorias: 330, proteinas: 18, carboidratos: 30, gorduras: 14 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 iogurte natural com sementes de chia e mel', calorias: 150, proteinas: 8, carboidratos: 18, gorduras: 5 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de sardinha assada\n3 colheres de arroz integral\nFeijão fradinho (3 colheres)\nCouve refogada com alho\nSalada de tomate e cebola\nAzeite e limão', calorias: 510, proteinas: 36, carboidratos: 44, gorduras: 20 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: '1 fatia de pão integral com queijo cottage e tomate seco\n1 xícara de chá', calorias: 170, proteinas: 10, carboidratos: 18, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Ratatouille (berinjela, abobrinha, tomate, pimentão) com queijo gratinado\nQuinoa (3 colheres)', calorias: 390, proteinas: 18, carboidratos: 40, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de erva-doce\n5 amêndoas', calorias: 70, proteinas: 3, carboidratos: 3, gorduras: 5 },
            ],
            sex: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Açaí puro (150ml) com banana e granola sem açúcar\n1 xícara de chá verde', calorias: 320, proteinas: 6, carboidratos: 50, gorduras: 10 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: '1 pera\n1 fatia de queijo minas\n2 castanhas-do-pará', calorias: 180, proteinas: 8, carboidratos: 18, gorduras: 8 },
                { tipo: '🍛 Almoço', horario: '12:30', alimentos: '150g de tilápia grelhada\nBatata-doce assada (100g)\nSalada de grão-de-bico, tomate, pepino, cebola e salsinha\nAzeite extra virgem', calorias: 480, proteinas: 34, carboidratos: 44, gorduras: 16 },
                { tipo: '🥤 Lanche da Tarde', horario: '15:30', alimentos: 'Wrap integral com homus, cenoura ralada e rúcula\n1 xícara de chá', calorias: 200, proteinas: 8, carboidratos: 26, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Risoto integral de cogumelos com parmesão\nSalada de rúcula com tomate cereja e balsâmico\nAzeite', calorias: 440, proteinas: 16, carboidratos: 52, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de camomila\n1 tangerina', calorias: 50, proteinas: 1, carboidratos: 12, gorduras: 0 },
            ],
            sab: [
                { tipo: '☀️ Café da Manhã', horario: '08:00', alimentos: 'Panqueca de aveia com frutas vermelhas\n1 fio de mel\n1 xícara de café com leite', calorias: 360, proteinas: 14, carboidratos: 48, gorduras: 12 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: 'Salada de frutas tropicais com hortelã (1 xícara)', calorias: 120, proteinas: 2, carboidratos: 28, gorduras: 1 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Bacalhau assado com batatas e cebola\nSalada de pimentão, azeitonas e alface\nAzeite extra virgem', calorias: 520, proteinas: 38, carboidratos: 36, gorduras: 22 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Bruschetta: pão integral com tomate picado, manjericão e azeite\n1 xícara de chá', calorias: 180, proteinas: 4, carboidratos: 22, gorduras: 8 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: 'Creme de abóbora com gengibre\nPeito de frango grelhado (120g)\nPão integral', calorias: 380, proteinas: 28, carboidratos: 36, gorduras: 12 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de leite morno com mel e canela', calorias: 100, proteinas: 4, carboidratos: 16, gorduras: 3 },
            ],
            dom: [
                { tipo: '☀️ Café da Manhã', horario: '08:30', alimentos: 'Ovo pochê sobre abacate amassado com torrada integral\n1 xícara de café\n1 laranja', calorias: 370, proteinas: 14, carboidratos: 32, gorduras: 20 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:30', alimentos: 'Iogurte grego com mel, nozes e banana fatiada', calorias: 220, proteinas: 10, carboidratos: 28, gorduras: 8 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: '150g de lombo suíno assado com ervas\nArroz integral (3 colheres)\nLentilha (3 colheres)\nLegumes assados: berinjela, pimentão, cebola\nAzeite', calorias: 520, proteinas: 36, carboidratos: 46, gorduras: 20 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: '1 fatia de bolo de laranja caseiro\n1 xícara de chá de hibisco', calorias: 180, proteinas: 3, carboidratos: 28, gorduras: 7 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Tabule: trigo, tomate, pepino, hortelã, salsinha, limão, azeite\nFrango desfiado (100g)', calorias: 360, proteinas: 24, carboidratos: 34, gorduras: 14 },
                { tipo: '🥛 Ceia', horario: '21:00', alimentos: '1 xícara de chá de ervas\n3 tâmaras', calorias: 80, proteinas: 1, carboidratos: 20, gorduras: 0 },
            ]
        }
    },

    // ═══════════════════════════════════════
    // 🏃 PERFORMANCE ESPORTIVA — ~2500-2800 kcal/dia
    // ═══════════════════════════════════════
    performance: {
        id: 'performance',
        name: 'Performance Esportiva',
        icon: '🏃',
        color: '#f59e0b',
        colorBg: 'rgba(245,158,11,0.08)',
        description: 'Dieta para atletas e praticantes de atividade física intensa. Alta em carboidratos complexos para energia, proteínas para recuperação muscular, e nutrientes essenciais para desempenho. Inclui refeições pré e pós-treino.',
        dailyCal: '2500–2800 kcal',
        macroSplit: '25% Proteína | 55% Carboidrato | 20% Gordura',
        tips: [
            'Refeição pré-treino: 1-2h antes, rica em carboidratos',
            'Pós-treino: até 30min após, proteína + carboidrato rápido',
            'Hidratação: mínimo 40ml por kg de peso corporal',
            'Sono de qualidade (8h) é essencial para recuperação',
        ],
        days: {
            seg: [
                { tipo: '☀️ Café da Manhã', horario: '06:00', alimentos: '3 ovos mexidos com aveia (2 colheres)\n2 fatias de pão integral com mel\n1 banana\n200ml de suco de laranja', calorias: 560, proteinas: 28, carboidratos: 72, gorduras: 16 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:00', alimentos: 'Vitamina: 300ml leite, banana, aveia (2 colheres), 1 colher de pasta de amendoim', calorias: 420, proteinas: 16, carboidratos: 54, gorduras: 16 },
                { tipo: '🍛 Almoço', horario: '12:00', alimentos: '200g de peito de frango grelhado\n5 colheres de arroz integral\n3 colheres de feijão\nBatata-doce (100g)\nSalada completa com azeite', calorias: 680, proteinas: 48, carboidratos: 78, gorduras: 16 },
                { tipo: '🏋️ Pré-treino', horario: '15:00', alimentos: '1 tapioca média com banana e mel\n200ml de suco de beterraba com laranja', calorias: 320, proteinas: 4, carboidratos: 68, gorduras: 3 },
                { tipo: '💪 Pós-treino', horario: '17:30', alimentos: 'Shake: 300ml leite, 1 banana, 2 colheres de aveia, 1 colher de cacau\n1 fatia de pão integral com mel', calorias: 440, proteinas: 18, carboidratos: 68, gorduras: 10 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: '200g de salmão grelhado\n4 colheres de macarrão integral\nBrócolis e cenoura refogados\nAzeite extra virgem', calorias: 580, proteinas: 44, carboidratos: 52, gorduras: 20 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Mingau de aveia com leite, banana e canela', calorias: 300, proteinas: 12, carboidratos: 44, gorduras: 8 },
            ],
            ter: [
                { tipo: '☀️ Café da Manhã', horario: '06:00', alimentos: 'Panqueca de banana e aveia (3 ovos, 3 colheres de aveia)\nMel e frutas vermelhas\n200ml de leite com café', calorias: 540, proteinas: 26, carboidratos: 66, gorduras: 16 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:00', alimentos: 'Pão integral com pasta de amendoim e banana fatiada\n1 maçã', calorias: 380, proteinas: 12, carboidratos: 52, gorduras: 14 },
                { tipo: '🍛 Almoço', horario: '12:00', alimentos: '200g de carne vermelha magra (patinho)\n5 colheres de arroz\n3 colheres de feijão preto\nMandioca cozida (100g)\nCouve refogada\nSalada', calorias: 700, proteinas: 48, carboidratos: 80, gorduras: 18 },
                { tipo: '🏋️ Pré-treino', horario: '15:00', alimentos: 'Açaí (200ml) com banana e granola\n200ml de água de coco', calorias: 380, proteinas: 6, carboidratos: 70, gorduras: 10 },
                { tipo: '💪 Pós-treino', horario: '17:30', alimentos: 'Batata-doce (150g) com frango desfiado (100g)\n1 banana', calorias: 380, proteinas: 28, carboidratos: 54, gorduras: 4 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: '200g de peito de frango ao forno\n4 colheres de arroz integral\nLegumes grelhados (abobrinha, pimentão, cebola)\nAzeite', calorias: 560, proteinas: 44, carboidratos: 54, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Iogurte integral com granola, banana e mel', calorias: 340, proteinas: 12, carboidratos: 48, gorduras: 10 },
            ],
            qua: [
                { tipo: '☀️ Café da Manhã', horario: '06:00', alimentos: 'Tapioca grande com ovos mexidos (3) e queijo\n1 mamão (½ unidade)\n200ml de suco natural', calorias: 520, proteinas: 26, carboidratos: 52, gorduras: 20 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:00', alimentos: 'Sanduíche: pão integral, peito de peru, queijo, alface\n1 banana com aveia', calorias: 400, proteinas: 22, carboidratos: 50, gorduras: 12 },
                { tipo: '🍛 Almoço', horario: '12:00', alimentos: '200g de filé de tilápia empanado ao forno (aveia)\n5 colheres de arroz integral\nFeijão carioca (3 colheres)\nPurê de abóbora\nSalada com azeite', calorias: 680, proteinas: 44, carboidratos: 78, gorduras: 18 },
                { tipo: '🏋️ Pré-treino', horario: '15:00', alimentos: '2 fatias de pão integral com geleia\n1 banana\n200ml de isotônico natural (água de coco + limão + sal)', calorias: 320, proteinas: 6, carboidratos: 66, gorduras: 4 },
                { tipo: '💪 Pós-treino', horario: '17:30', alimentos: 'Vitamina proteica: leite, banana, aveia, cacau, mel\n1 ovo cozido', calorias: 420, proteinas: 22, carboidratos: 56, gorduras: 12 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: 'Macarrão integral (200g) com molho bolonhesa (carne moída 150g)\nQueijo parmesão\nSalada verde', calorias: 620, proteinas: 40, carboidratos: 70, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Pão integral com queijo branco e mel\n200ml de leite', calorias: 280, proteinas: 14, carboidratos: 36, gorduras: 8 },
            ],
            qui: [
                { tipo: '☀️ Café da Manhã', horario: '06:00', alimentos: 'Mingau de aveia com banana, mel e canela\n2 ovos cozidos\n200ml de suco de acerola', calorias: 500, proteinas: 22, carboidratos: 66, gorduras: 14 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:00', alimentos: 'Wrap integral com frango, alface e requeijão\n1 maçã', calorias: 380, proteinas: 22, carboidratos: 42, gorduras: 12 },
                { tipo: '🍛 Almoço', horario: '12:00', alimentos: '200g de sobrecoxa de frango sem pele ao forno\n5 colheres de arroz\n3 colheres de grão-de-bico\nBatata cozida (100g)\nSalada com azeite', calorias: 700, proteinas: 48, carboidratos: 76, gorduras: 18 },
                { tipo: '🏋️ Pré-treino', horario: '15:00', alimentos: 'Crepioca com banana e canela\n200ml de suco de laranja', calorias: 300, proteinas: 10, carboidratos: 56, gorduras: 4 },
                { tipo: '💪 Pós-treino', horario: '17:30', alimentos: 'Batata-doce assada (150g) com atum em lata\n1 banana com mel', calorias: 400, proteinas: 26, carboidratos: 60, gorduras: 6 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: '200g de carne vermelha grelhada\n4 colheres de arroz integral\nFeijão (3 colheres)\nEspinafre refogado\nSalada', calorias: 620, proteinas: 46, carboidratos: 60, gorduras: 18 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Tapioca com queijo e presunto\n200ml de leite', calorias: 320, proteinas: 16, carboidratos: 38, gorduras: 10 },
            ],
            sex: [
                { tipo: '☀️ Café da Manhã', horario: '06:00', alimentos: 'Pão francês (2) com ovos mexidos e queijo\n1 banana\n200ml de café com leite', calorias: 560, proteinas: 26, carboidratos: 58, gorduras: 22 },
                { tipo: '🍎 Lanche da Manhã', horario: '09:00', alimentos: 'Açaí (200ml) com granola e banana\n1 colher de mel', calorias: 420, proteinas: 6, carboidratos: 72, gorduras: 12 },
                { tipo: '🍛 Almoço', horario: '12:00', alimentos: '200g de salmão ao forno\n5 colheres de arroz integral\nPurê de batata-doce\nBrócolis e couve-flor no vapor\nAzeite', calorias: 700, proteinas: 48, carboidratos: 70, gorduras: 22 },
                { tipo: '🏋️ Pré-treino', horario: '15:00', alimentos: '2 fatias de pão integral com mel e banana\n200ml de isotônico', calorias: 340, proteinas: 6, carboidratos: 70, gorduras: 4 },
                { tipo: '💪 Pós-treino', horario: '17:30', alimentos: 'Shake: leite, banana, aveia, pasta de amendoim, mel\n1 fatia de pão com queijo', calorias: 480, proteinas: 20, carboidratos: 60, gorduras: 16 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: '200g de frango grelhado\nMacarrão integral (150g) com azeite e alho\nSalada verde\nLegumes', calorias: 580, proteinas: 44, carboidratos: 58, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Mingau de aveia com leite e mel\n1 colher de pasta de amendoim', calorias: 340, proteinas: 12, carboidratos: 44, gorduras: 12 },
            ],
            sab: [
                { tipo: '☀️ Café da Manhã', horario: '07:00', alimentos: 'Panqueca americana de aveia (3 ovos, aveia, banana)\nMel, frutas e iogurte\n200ml de suco natural', calorias: 540, proteinas: 24, carboidratos: 68, gorduras: 16 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: 'Pão integral com abacate amassado e ovo pochê\n1 xícara de café', calorias: 360, proteinas: 14, carboidratos: 28, gorduras: 20 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Churrasco magro: 200g de maminha ou fraldinha\nArroz (4 colheres)\nFeijão tropeiro (3 colheres)\nVinagrete\nFarofa de ovos', calorias: 740, proteinas: 48, carboidratos: 76, gorduras: 24 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Vitamina de abacate com leite, mel e aveia\n1 barra de cereal', calorias: 420, proteinas: 10, carboidratos: 48, gorduras: 20 },
                { tipo: '🌙 Jantar', horario: '19:30', alimentos: 'Hambúrguer caseiro: carne, pão integral, queijo, alface, tomate\nBatata-doce assada (150g)', calorias: 620, proteinas: 38, carboidratos: 58, gorduras: 24 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Iogurte com granola e banana\n1 copo de leite', calorias: 320, proteinas: 14, carboidratos: 42, gorduras: 10 },
            ],
            dom: [
                { tipo: '☀️ Café da Manhã', horario: '07:30', alimentos: 'Pão de queijo (3 unidades)\n3 ovos mexidos com tomate\n200ml de suco de maracujá\n½ mamão', calorias: 540, proteinas: 24, carboidratos: 52, gorduras: 24 },
                { tipo: '🍎 Lanche da Manhã', horario: '10:00', alimentos: 'Shake: leite, morango, aveia, mel, banana', calorias: 380, proteinas: 14, carboidratos: 56, gorduras: 10 },
                { tipo: '🍛 Almoço', horario: '13:00', alimentos: 'Lasanha integral: carne moída, queijo, molho de tomate\nSalada verde com azeite\nSuco natural', calorias: 700, proteinas: 40, carboidratos: 72, gorduras: 24 },
                { tipo: '🥤 Lanche da Tarde', horario: '16:00', alimentos: 'Tapioca com queijo e presunto\n1 banana com pasta de amendoim', calorias: 400, proteinas: 18, carboidratos: 48, gorduras: 14 },
                { tipo: '🌙 Jantar', horario: '19:00', alimentos: 'Risoto integral de frango com legumes\nSalada de folhas com tomate cereja\nAzeite', calorias: 560, proteinas: 34, carboidratos: 64, gorduras: 16 },
                { tipo: '🥛 Ceia', horario: '21:30', alimentos: 'Pão integral com manteiga de amendoim e mel\n200ml de leite', calorias: 340, proteinas: 14, carboidratos: 40, gorduras: 14 },
            ]
        }
    }
};
