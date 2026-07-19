const jsContent = `
    // ========== FEATURE: TABS ANAMNESE ==========
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabsContainer = e.target.closest('.modal-tabs');
            const targetId = e.target.dataset.tab;
            
            tabsContainer.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const modalBody = e.target.closest('.modal-body');
            modalBody.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            modalBody.querySelector('#' + targetId).classList.add('active');
            
            // hide contents manually for safety if css animation is missing
            modalBody.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
            modalBody.querySelector('#' + targetId).style.display = 'block';
        });
    });

    // Patch btn-save-patient to include anamnese fields
    const origSavePatient = document.getElementById('btn-save-patient').onclick;
    // Actually we need to override the click listener. 
    // The previous listener is anonymous, so we have to clone the button to remove old listeners.
    const btnSavePatient = document.getElementById('btn-save-patient');
    const newBtnSave = btnSavePatient.cloneNode(true);
    btnSavePatient.parentNode.replaceChild(newBtnSave, btnSavePatient);
    
    newBtnSave.addEventListener('click', () => {
        const nome = document.getElementById('p-nome').value.trim();
        if (!nome) { showToast('Nome é obrigatório.', 'error'); return; }

        const editId = document.getElementById('patient-edit-id').value;
        const data = {
            id: editId ? parseInt(editId) : Date.now(),
            nome,
            email: document.getElementById('p-email').value.trim(),
            telefone: document.getElementById('p-telefone').value.trim(),
            nascimento: document.getElementById('p-nascimento').value,
            sexo: document.getElementById('p-sexo').value,
            objetivo: document.getElementById('p-objetivo').value,
            peso: parseFloat(document.getElementById('p-peso').value) || null,
            altura: parseFloat(document.getElementById('p-altura').value) || null,
            alergias: document.getElementById('p-alergias').value.trim(),
            obs: document.getElementById('p-obs').value.trim(),
            // Anamnese fields
            refeicoes: document.getElementById('p-refeicoes').value,
            restricoes: document.getElementById('p-restricoes').value.trim(),
            favoritos: document.getElementById('p-favoritos').value.trim(),
            naoGosta: document.getElementById('p-nao-gosta').value.trim(),
            atividade: document.getElementById('p-ativ').value,
            freqExer: document.getElementById('p-freq-exer').value.trim(),
            tipoExer: document.getElementById('p-tipo-exer').value.trim(),
            sonoHr: document.getElementById('p-sono-hr').value,
            sonoQual: document.getElementById('p-sono-qual').value,
            fumante: document.getElementById('p-fumante').value,
            alcool: document.getElementById('p-alcool').value,
            doencas: document.getElementById('p-doencas').value.trim(),
            medicamentos: document.getElementById('p-medicamentos').value.trim(),
            histFam: document.getElementById('p-hist-fam').value.trim(),
            intestino: document.getElementById('p-intestino').value,
            aguaEst: document.getElementById('p-agua-est').value.trim(),
            createdAt: editId ? patients.find(p => p.id === parseInt(editId))?.createdAt : new Date().toISOString()
        };

        if (editId) {
            const idx = patients.findIndex(p => p.id === parseInt(editId));
            if (idx >= 0) patients[idx] = data;
        } else {
            patients.push(data);
        }

        Store.set('patients', patients);
        document.getElementById('modal-paciente').classList.remove('open');
        renderPatients();
        refreshPatientSelects();
        showToast(editId ? 'Paciente atualizado!' : 'Paciente cadastrado!', 'success');
        checkAchievements(data.id, 'Primeira Consulta');
    });

    // We also need to override editPatient global function to load anamnese fields
    const origEditPatient = window.editPatient;
    window.editPatient = function(id) {
        const p = patients.find(x => x.id === id);
        if (!p) return;
        origEditPatient(id);
        
        document.getElementById('p-refeicoes').value = p.refeicoes || '';
        document.getElementById('p-restricoes').value = p.restricoes || '';
        document.getElementById('p-favoritos').value = p.favoritos || '';
        document.getElementById('p-nao-gosta').value = p.naoGosta || '';
        document.getElementById('p-ativ').value = p.atividade || '';
        document.getElementById('p-freq-exer').value = p.freqExer || '';
        document.getElementById('p-tipo-exer').value = p.tipoExer || '';
        document.getElementById('p-sono-hr').value = p.sonoHr || '';
        document.getElementById('p-sono-qual').value = p.sonoQual || '';
        document.getElementById('p-fumante').value = p.fumante || '';
        document.getElementById('p-alcool').value = p.alcool || '';
        document.getElementById('p-doencas').value = p.doencas || '';
        document.getElementById('p-medicamentos').value = p.medicamentos || '';
        document.getElementById('p-hist-fam').value = p.histFam || '';
        document.getElementById('p-intestino').value = p.intestino || '';
        document.getElementById('p-agua-est').value = p.aguaEst || '';
        
        // Ensure first tab is active
        document.querySelector('.modal-tab[data-tab="tab-p-dados"]').click();
    };
    
    // clearPatientForm patching
    const btnOpenPatient = document.getElementById('btn-open-patient-modal');
    btnOpenPatient.addEventListener('click', () => {
        ['p-refeicoes','p-restricoes','p-favoritos','p-nao-gosta','p-ativ','p-freq-exer','p-tipo-exer','p-sono-hr','p-sono-qual','p-fumante','p-alcool','p-doencas','p-medicamentos','p-hist-fam','p-intestino','p-agua-est']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        document.querySelector('.modal-tab[data-tab="tab-p-dados"]').click();
    });


    // ========== FEATURE: MEDIDAS ==========
    let medidasLog = Store.get('measurements');
    
    function renderMedidas() {
        const pacienteId = document.getElementById('med-paciente').value;
        const historyContainer = document.getElementById('medidas-history');
        
        if (!pacienteId) {
            historyContainer.innerHTML = '<div class="empty-small">Selecione um paciente para ver o histórico.</div>';
            return;
        }
        
        const pacId = parseInt(pacienteId);
        const filtered = medidasLog.filter(m => m.patientId === pacId).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filtered.length === 0) {
            historyContainer.innerHTML = '<div class="empty-small">Nenhuma medida registrada.</div>';
            return;
        }
        
        historyContainer.innerHTML = filtered.map((m, i) => {
            const isFirst = (i === 0);
            const prev = filtered[i+1];
            
            const renderStat = (lbl, val, key) => {
                let trend = '';
                if (val && prev && prev[key]) {
                    const diff = parseFloat(val) - parseFloat(prev[key]);
                    if (diff > 0) trend = '<span class="trend-up">↑</span>';
                    else if (diff < 0) trend = '<span class="trend-down">↓</span>';
                    else trend = '<span class="trend-eq">=</span>';
                }
                return val ? \`<div class="medida-stat"><span class="medida-stat-lbl">\${lbl}</span><span class="medida-stat-val">\${val} \${trend}</span></div>\` : '';
            };
            
            return \`
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">\${formatDate(m.date)}</span>
                    <div class="history-actions"><button onclick="deleteMedida(\${m.id})">Remover</button></div>
                </div>
                <div class="medida-grid">
                    \${renderStat('Peso', m.peso, 'peso')}
                    \${renderStat('Cintura', m.cintura, 'cintura')}
                    \${renderStat('Quadril', m.quadril, 'quadril')}
                    \${renderStat('Braço D', m.bracoD, 'bracoD')}
                    \${renderStat('Braço E', m.bracoE, 'bracoE')}
                    \${renderStat('Coxa D', m.coxaD, 'coxaD')}
                    \${renderStat('Coxa E', m.coxaE, 'coxaE')}
                    \${renderStat('Panturrilha', m.panturrilha, 'panturrilha')}
                    \${renderStat('Peitoral', m.peitoral, 'peitoral')}
                </div>
            </div>
            \`;
        }).join('');
    }
    
    window.deleteMedida = function(id) {
        if (!confirm('Remover esta medida?')) return;
        medidasLog = medidasLog.filter(m => m.id !== id);
        Store.set('measurements', medidasLog);
        renderMedidas();
    };
    
    document.getElementById('med-paciente').addEventListener('change', renderMedidas);
    
    document.getElementById('btn-add-medida').addEventListener('click', () => {
        const pacienteId = document.getElementById('med-paciente').value;
        const date = document.getElementById('med-data').value;
        if (!pacienteId || !date) { showToast('Preencha paciente e data.', 'error'); return; }
        
        const p = patients.find(x => x.id === parseInt(pacienteId));
        
        const m = {
            id: Date.now(),
            patientId: parseInt(pacienteId),
            patientName: p.nome,
            date: date,
            peso: document.getElementById('med-peso').value,
            cintura: document.getElementById('med-cintura').value,
            quadril: document.getElementById('med-quadril').value,
            bracoD: document.getElementById('med-braco-d').value,
            bracoE: document.getElementById('med-braco-e').value,
            coxaD: document.getElementById('med-coxa-d').value,
            coxaE: document.getElementById('med-coxa-e').value,
            panturrilha: document.getElementById('med-panturrilha').value,
            peitoral: document.getElementById('med-peitoral').value,
        };
        
        medidasLog.push(m);
        Store.set('measurements', medidasLog);
        renderMedidas();
        showToast('Medidas registradas!', 'success');
        
        // RCQ calculation
        if (m.cintura && m.quadril) {
            const rcq = parseFloat(m.cintura) / parseFloat(m.quadril);
            const res = document.getElementById('rcq-result');
            res.style.display = 'block';
            document.getElementById('rcq-val').textContent = rcq.toFixed(2);
            
            let risco = 'Normal';
            if (p.sexo === 'Feminino') {
                if (rcq >= 0.86) risco = 'Alto Risco';
                else if (rcq >= 0.81) risco = 'Moderado';
            } else {
                if (rcq >= 1.0) risco = 'Alto Risco';
                else if (rcq >= 0.96) risco = 'Moderado';
            }
            document.getElementById('rcq-class').textContent = risco;
        }
        
        checkAchievements(p.id, 'Medidas Registradas');
    });

    window.refreshMedidasView = function() {
        refreshPatientSelects();
        renderMedidas();
    };


    // ========== FEATURE: EXAMES ==========
    let examesLog = Store.get('exams');
    const examRefs = {
        'Glicemia em Jejum': { unit: 'mg/dL', min: 70, max: 99 },
        'Hemoglobina Glicada': { unit: '%', min: 0, max: 5.7 },
        'Colesterol Total': { unit: 'mg/dL', min: 0, max: 200 },
        'HDL': { unit: 'mg/dL', min: 40, max: 100 }, // simplified
        'LDL': { unit: 'mg/dL', min: 0, max: 130 },
        'Triglicerídeos': { unit: 'mg/dL', min: 0, max: 150 },
        'TSH': { unit: 'mUI/L', min: 0.4, max: 4.0 },
        'T4 Livre': { unit: 'ng/dL', min: 0.8, max: 1.8 },
        'Vitamina D': { unit: 'ng/mL', min: 30, max: 60 },
        'Vitamina B12': { unit: 'pg/mL', min: 200, max: 900 },
        'Ferro Sérico': { unit: 'mcg/dL', min: 60, max: 170 },
        'Ferritina': { unit: 'ng/mL', min: 12, max: 300 },
        'Hemoglobina': { unit: 'g/dL', min: 12, max: 17.5 },
        'Ácido Úrico': { unit: 'mg/dL', min: 2.5, max: 7.0 },
        'Creatinina': { unit: 'mg/dL', min: 0.6, max: 1.2 },
        'TGO/AST': { unit: 'U/L', min: 0, max: 40 },
        'TGP/ALT': { unit: 'U/L', min: 0, max: 41 }
    };
    
    document.getElementById('ex-tipo').addEventListener('change', (e) => {
        const t = e.target.value;
        if (examRefs[t]) {
            document.getElementById('ex-ref').value = \`\${examRefs[t].min} - \${examRefs[t].max} \${examRefs[t].unit}\`;
        } else {
            document.getElementById('ex-ref').value = '';
        }
    });
    
    document.getElementById('btn-add-exame').addEventListener('click', () => {
        const pacienteId = document.getElementById('ex-paciente').value;
        const date = document.getElementById('ex-data').value;
        const tipo = document.getElementById('ex-tipo').value;
        const valor = parseFloat(document.getElementById('ex-valor').value);
        
        if (!pacienteId || !date || !tipo || isNaN(valor)) { showToast('Preencha todos os campos.', 'error'); return; }
        
        const p = patients.find(x => x.id === parseInt(pacienteId));
        const ref = examRefs[tipo];
        let status = 'Normal';
        if (valor < ref.min || valor > ref.max) status = 'Alterado';
        
        const eData = {
            id: Date.now(),
            patientId: parseInt(pacienteId),
            patientName: p.nome,
            date: date,
            examType: tipo,
            value: valor,
            unit: ref.unit,
            refMin: ref.min,
            refMax: ref.max,
            status: status
        };
        
        examesLog.push(eData);
        Store.set('exams', examesLog);
        renderExames();
        showToast('Exame registrado!', 'success');
    });
    
    document.getElementById('ex-paciente').addEventListener('change', renderExames);
    
    function renderExames() {
        const pacienteId = document.getElementById('ex-paciente').value;
        const historyContainer = document.getElementById('exames-history');
        
        if (!pacienteId) {
            historyContainer.innerHTML = '<div class="empty-small">Selecione um paciente para ver os exames.</div>';
            return;
        }
        
        const pacId = parseInt(pacienteId);
        const filtered = examesLog.filter(m => m.patientId === pacId).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filtered.length === 0) {
            historyContainer.innerHTML = '<div class="empty-small">Nenhum exame registrado.</div>';
            return;
        }
        
        // Group by date
        const grouped = {};
        filtered.forEach(e => {
            if (!grouped[e.date]) grouped[e.date] = [];
            grouped[e.date].push(e);
        });
        
        historyContainer.innerHTML = Object.keys(grouped).sort((a,b) => new Date(b)-new Date(a)).map(date => {
            const exms = grouped[date];
            return \`
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">\${formatDate(date)}</span>
                </div>
                <table class="exame-table">
                    <thead><tr><th>Exame</th><th>Resultado</th><th>Referência</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                        \${exms.map(e => \`
                        <tr>
                            <td>\${e.examType}</td>
                            <td><strong>\${e.value} \${e.unit}</strong></td>
                            <td><span style="font-size:0.75rem;color:var(--text-muted)">\${e.refMin}-\${e.refMax}</span></td>
                            <td><span class="status-badge status-\${e.status}">\${e.status}</span></td>
                            <td><button onclick="deleteExame(\${e.id})" style="background:none;border:none;color:var(--red);cursor:pointer;">✕</button></td>
                        </tr>
                        \`).join('')}
                    </tbody>
                </table>
            </div>
            \`;
        }).join('');
    }
    
    window.deleteExame = function(id) {
        if (!confirm('Remover este exame?')) return;
        examesLog = examesLog.filter(e => e.id !== id);
        Store.set('exams', examesLog);
        renderExames();
    };
    
    window.refreshExamesView = function() {
        refreshPatientSelects();
        renderExames();
    };


    // ========== FEATURE: SHARE DIET (PDF / WhatsApp) ==========
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        if (meals.length === 0) { showToast('Nenhuma refeição para exportar.', 'error'); return; }
        
        const ptId = document.getElementById('diet-paciente-select').value;
        const pt = ptId ? patients.find(p => p.id === parseInt(ptId)) : null;
        const dayLabels = { all: 'Todos os dias', seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };
        
        const printDiv = document.getElementById('print-diet');
        let html = \`
            <div class="print-header">
                <div class="print-title">Plano Alimentar Individualizado</div>
                <div class="print-subtitle">Nutricionista - CRN 12345</div>
            </div>
            <div class="print-patient-info">
                <div><strong>Paciente:</strong> \${pt ? pt.nome : 'Geral'}</div>
                <div><strong>Data:</strong> \${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
        \`;
        
        const grouped = {};
        meals.forEach(m => {
            if (ptId && m.pacienteId !== parseInt(ptId)) return;
            const key = m.dia || 'all';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(m);
        });
        
        Object.keys(grouped).forEach(day => {
            html += \`<div class="print-day">\`;
            html += \`<div class="print-day-title">\${dayLabels[day] || day}</div>\`;
            grouped[day].sort((a, b) => (a.horario || '').localeCompare(b.horario || '')).forEach(m => {
                html += \`
                <div class="print-meal">
                    <div class="print-meal-header">
                        <span>\${m.tipo}</span>
                        \${m.horario ? \`<span class="print-meal-time">(\${m.horario})</span>\` : ''}
                    </div>
                    <div class="print-meal-foods">\${m.alimentos}</div>
                    \`;
                if(m.calorias || m.proteinas) {
                    html += \`<div class="print-meal-macros">\${m.calorias} kcal | \${m.proteinas}g P | \${m.carboidratos}g C | \${m.gorduras}g G</div>\`;
                }
                if(m.obs) {
                    html += \`<div class="print-meal-obs">Obs: \${m.obs}</div>\`;
                }
                html += \`</div>\`;
            });
            html += \`</div>\`;
        });
        
        html += \`<div class="print-footer">Este plano é individual e intransferível.</div>\`;
        
        printDiv.innerHTML = html;
        window.print();
        
        if (pt) checkAchievements(pt.id, 'Plano Criado');
    });

    document.getElementById('btn-share-whatsapp').addEventListener('click', () => {
        if (meals.length === 0) { showToast('Nenhuma refeição para compartilhar.', 'error'); return; }
        
        const ptId = document.getElementById('diet-paciente-select').value;
        const dayLabels = { all: 'Todos os dias', seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };
        
        let text = '*🍎 PLANO ALIMENTAR*\n\n';
        
        const grouped = {};
        meals.forEach(m => {
            if (ptId && m.pacienteId !== parseInt(ptId)) return;
            const key = m.dia || 'all';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(m);
        });
        
        Object.keys(grouped).forEach(day => {
            text += \`*--- \${(dayLabels[day] || day).toUpperCase()} ---*\n\n\`;
            grouped[day].sort((a, b) => (a.horario || '').localeCompare(b.horario || '')).forEach(m => {
                text += \`🕒 *\${m.tipo}* \${m.horario ? '('+m.horario+')' : ''}\n\`;
                text += \`\${m.alimentos}\n\`;
                if(m.obs) text += \`📌 _Obs: \${m.obs}_\n\`;
                text += '\n';
            });
        });
        
        const url = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(url, '_blank');
        
        if (ptId) checkAchievements(parseInt(ptId), 'Plano Criado');
    });


    // ========== FEATURE: GAMIFICATION ==========
    let achievements = Store.get('achievements');
    const badgeDefs = {
        '💧 Hidratação 7 dias': { icon: '💧', desc: '7 dias consecutivos atingindo a meta de água' },
        '🎯 Primeira Consulta': { icon: '🎯', desc: 'Paciente realizou a primeira consulta' },
        '📊 IMC Calculado': { icon: '📊', desc: 'Primeiro cálculo de IMC realizado' },
        '🥗 Plano Criado': { icon: '🥗', desc: 'Primeiro plano alimentar montado' },
        '⚖️ 5kg Perdidos': { icon: '⚖️', desc: 'Perdeu 5kg desde o primeiro registro' },
        '📏 Medidas Registradas': { icon: '📏', desc: 'Primeira medida corporal salva' },
        '🔥 30 Dias de Dieta': { icon: '🔥', desc: '30 dias desde o primeiro plano' },
        '💪 Meta Atingida': { icon: '💪', desc: 'Atingiu a meta de peso (objetivo)' }
    };

    window.checkAchievements = function(patientId, eventType) {
        if (!patientId) return;
        const pt = patients.find(p => p.id === patientId);
        if (!pt) return;
        
        let earned = false;
        const addBadge = (title) => {
            if (!achievements.find(a => a.patientId === patientId && a.title === title)) {
                achievements.push({
                    id: Date.now(),
                    patientId,
                    patientName: pt.nome,
                    title,
                    date: new Date().toISOString()
                });
                earned = true;
                showToast(\`🏆 Conquista Desbloqueada: \${title} (\${pt.nome})\`, 'success');
            }
        };

        if (eventType === 'Primeira Consulta') addBadge('🎯 Primeira Consulta');
        if (eventType === 'IMC Calculado') addBadge('📊 IMC Calculado');
        if (eventType === 'Plano Criado') addBadge('🥗 Plano Criado');
        if (eventType === 'Medidas Registradas') addBadge('📏 Medidas Registradas');
        if (eventType === 'Hidratação 7 dias') addBadge('💧 Hidratação 7 dias'); // Simplified checking
        
        if (earned) {
            Store.set('achievements', achievements);
            renderDashboardAchievements();
        }
    };
    
    // Inject checking into IMC
    const origCalcIMC = document.getElementById('btn-calc-imc').onclick;
    document.getElementById('btn-calc-imc').addEventListener('click', () => {
        const ptSelect = document.getElementById('imc-paciente-select').value;
        if (ptSelect) checkAchievements(parseInt(ptSelect), 'IMC Calculado');
    });

    function renderDashboardAchievements() {
        const container = document.getElementById('dash-achievements');
        if (!container) return;
        
        if (achievements.length === 0) {
            container.innerHTML = '<div class="empty-small">Nenhuma conquista ainda.</div>';
            return;
        }
        
        const recent = [...achievements].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        
        container.innerHTML = recent.map(a => {
            const def = badgeDefs[a.title] || { icon: '🏆', desc: 'Conquista especial' };
            return \`
            <div class="badge-item">
                <div class="badge-icon">\${def.icon}</div>
                <div class="badge-info">
                    <div class="badge-title">\${a.title.substring(3)}</div>
                    <div class="badge-desc">\${def.desc}</div>
                    <div class="badge-meta">\${a.patientName} · \${formatDate(a.date)}</div>
                </div>
            </div>
            \`;
        }).join('');
    }

    // Override refreshDashboard to include renderDashboardAchievements
    const origRefreshDash = window.refreshDashboard; // wait, refreshDashboard is not on window. It's local.
    // Let's hook into window.navigateTo for dashboard
    
    const origNavigateTo = window.navigateTo;
    window.navigateTo = function(viewName) {
        origNavigateTo(viewName);
        if (viewName === 'dashboard') {
            renderDashboardAchievements();
        }
        if (viewName === 'medidas') {
            window.refreshMedidasView();
        }
        if (viewName === 'exames') {
            window.refreshExamesView();
        }
    };

    // Initial render for dashboard gamification
    renderDashboardAchievements();
`;

const fs = require('fs');
fs.appendFileSync('script.js', jsContent);
console.log('script.js updated.');
