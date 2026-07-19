/* ========================================
   Lo Diet — Professional Nutritionist Platform
   Complete Application Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== DATA STORE ==========
    const Store = {
        get(key, fallback = []) {
            try { return JSON.parse(localStorage.getItem(`lodiet_${key}`)) || fallback; }
            catch { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(`lodiet_${key}`, JSON.stringify(value)); }
            catch(e) { console.warn('localStorage quota exceeded', e); }
        }
    };

    let patients = Store.get('patients');
    let meals = Store.get('meals');
    let imcHistory = Store.get('imc_history');
    let notes = Store.get('notes');
    let waterLog = Store.get('water_log');
    let waterGoal = Store.get('water_goal', 2000);
    let imcCount = Store.get('imc_count', 0);
    let weightRecords = Store.get('weight_records');
    let appointments = Store.get('appointments');
    let currentTheme = Store.get('theme', 'light');

    // ========== NAVIGATION ==========
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navItems = document.querySelectorAll('.nav-item');

    hamburger.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
    });

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    }

    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            navigateTo(view);
            closeSidebar();
        });
    });

    window.navigateTo = function(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const targetView = document.getElementById(`view-${viewName}`);
        const targetNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

        if (targetView) targetView.classList.add('active');
        if (targetNav) targetNav.classList.add('active');

        // Refresh data on view change
        if (viewName === 'dashboard') refreshDashboard();
        if (viewName === 'pacientes') renderPatients();
        if (viewName === 'imc') refreshIMCView();
        if (viewName === 'dieta') refreshDietView();
        if (viewName === 'agua') refreshWaterView();
        if (viewName === 'anotacoes') renderNotes();
        if (viewName === 'evolucao') refreshEvolucaoView();
        if (viewName === 'agenda') refreshAgendaView();
        if (viewName === 'financeiro') refreshFinanceiroView();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ========== TOAST ==========
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========== UTILITIES ==========
    function formatDate(iso) {
        return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function getInitials(name) {
        return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }

    const avatarColors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#ec4899','#06b6d4','#f97316'];

    function getAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return avatarColors[Math.abs(hash) % avatarColors.length];
    }

    function calcAge(birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }

    // ========== DASHBOARD ==========
    function refreshDashboard() {
        // Date
        document.getElementById('header-date').textContent =
            new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        // Stats
        document.getElementById('stat-pacientes').textContent = patients.length;
        document.getElementById('stat-dietas').textContent = meals.length;
        document.getElementById('stat-imcs').textContent = imcCount;

        const todayWater = getTodayWaterTotal();
        document.getElementById('stat-agua').textContent = todayWater >= 1000 ? `${(todayWater / 1000).toFixed(1)}L` : `${todayWater}ml`;

        // Recent patients
        const rpContainer = document.getElementById('dash-recent-patients');
        if (patients.length === 0) {
            rpContainer.innerHTML = '<div class="empty-small">Nenhum paciente cadastrado ainda.</div>';
        } else {
            const recent = patients.slice(-4).reverse();
            rpContainer.innerHTML = recent.map(p => `
                <div class="recent-patient-item">
                    <div class="rp-avatar" style="background:${getAvatarColor(p.nome)}">${getInitials(p.nome)}</div>
                    <div class="rp-info">
                        <div class="rp-name">${p.nome}</div>
                        <div class="rp-detail">${p.objetivo || 'Sem objetivo definido'}${p.peso ? ` · ${p.peso}kg` : ''}</div>
                    </div>
                </div>
            `).join('');
        }

        // Recent IMC
        const ihContainer = document.getElementById('dash-imc-history');
        if (imcHistory.length === 0) {
            ihContainer.innerHTML = '<div class="empty-small">Nenhum cálculo realizado ainda.</div>';
        } else {
            const recent = imcHistory.slice(-4).reverse();
            ihContainer.innerHTML = recent.map(h => {
                const cls = classifyIMC(h.imc);
                return `
                <div class="imc-hist-item">
                    <div class="imc-hist-left">
                        <span class="imc-hist-badge badge-${cls.cssClass}">${h.imc.toFixed(1)}</span>
                        <span class="imc-hist-name">${h.nome}</span>
                    </div>
                    <span class="imc-hist-date">${formatDate(h.date)}</span>
                </div>`;
            }).join('');
        }

        // Tip
        const tips = [
            { text: 'A hidratação adequada melhora o metabolismo e auxilia na perda de peso. Recomende ao menos 35ml por kg de peso corporal.', source: 'Diretriz OMS' },
            { text: 'O fracionamento das refeições em 5-6 porções diárias ajuda a manter o metabolismo ativo e controlar a fome.', source: 'Guia Alimentar para a População Brasileira' },
            { text: 'Proteínas de alto valor biológico (ovo, peixe, frango) devem estar presentes em todas as refeições principais.', source: 'Consenso ABRAN' },
            { text: 'Fibras solúveis (aveia, chia, linhaça) promovem saciedade e ajudam no controle glicêmico dos pacientes.', source: 'American Dietetic Association' },
            { text: 'O IMC não diferencia massa muscular de gordura. Complemente com outras avaliações como circunferência abdominal e bioimpedância.', source: 'Diretriz ABESO' },
            { text: 'Alimentos ultraprocessados estão associados a maior risco de obesidade, diabetes e doenças cardiovasculares.', source: 'Estudo NutriNet-Brasil' },
            { text: 'Uma boa anamnese alimentar é o primeiro passo para um plano de dieta eficaz. Dedique tempo para entender os hábitos do paciente.', source: 'Manual de Nutrição Clínica' },
        ];
        const tip = tips[Math.floor(Math.random() * tips.length)];
        document.querySelector('.tip-text').textContent = `"${tip.text}"`;
        document.querySelector('.tip-source').textContent = `— ${tip.source}`;
    }

    // ========== PATIENTS ==========
    function renderPatients(filter = '') {
        const grid = document.getElementById('patients-grid');
        let filtered = patients;

        if (filter) {
            const q = filter.toLowerCase();
            filtered = patients.filter(p =>
                p.nome.toLowerCase().includes(q) ||
                (p.email && p.email.toLowerCase().includes(q)) ||
                (p.telefone && p.telefone.includes(q))
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="empty-state">
                <div class="empty-icon">👤</div>
                <h3>${filter ? 'Nenhum resultado encontrado' : 'Nenhum paciente cadastrado'}</h3>
                <p>${filter ? 'Tente outra busca.' : 'Clique em "Novo Paciente" para começar.'}</p>
            </div>`;
            return;
        }

        grid.innerHTML = filtered.map((p, i) => {
            const age = calcAge(p.nascimento);
            const imc = (p.peso && p.altura) ? (p.peso / (p.altura * p.altura)) : null;
            const imcClass = imc ? classifyIMC(imc) : null;

            return `
            <div class="patient-card" style="animation-delay:${i * 0.05}s">
                <div class="pc-top">
                    <div class="pc-avatar" style="background:${getAvatarColor(p.nome)}">${getInitials(p.nome)}</div>
                    <div class="pc-info">
                        <div class="pc-name">${p.nome}</div>
                        <div class="pc-meta">${p.email || ''}${p.email && p.telefone ? ' · ' : ''}${p.telefone || ''}</div>
                    </div>
                </div>
                <div class="pc-tags">
                    ${p.objetivo ? `<span class="pc-tag objetivo">${p.objetivo}</span>` : ''}
                    ${p.sexo ? `<span class="pc-tag sexo">${p.sexo}</span>` : ''}
                    ${imcClass ? `<span class="pc-tag imc-tag">IMC ${imc.toFixed(1)}</span>` : ''}
                </div>
                <div class="pc-details">
                    <div class="pc-detail-item"><span class="pc-detail-label">Peso</span><span class="pc-detail-value">${p.peso ? p.peso + ' kg' : '—'}</span></div>
                    <div class="pc-detail-item"><span class="pc-detail-label">Altura</span><span class="pc-detail-value">${p.altura ? p.altura + ' m' : '—'}</span></div>
                    <div class="pc-detail-item"><span class="pc-detail-label">Idade</span><span class="pc-detail-value">${age !== null ? age + ' anos' : '—'}</span></div>
                    <div class="pc-detail-item"><span class="pc-detail-label">IMC</span><span class="pc-detail-value">${imc ? imc.toFixed(1) + ' - ' + imcClass.label : '—'}</span></div>
                </div>
                ${p.alergias ? `<div class="pc-alerts">⚠️ ${p.alergias}</div>` : ''}
                <div class="pc-actions">
                    <button class="pc-btn" onclick="editPatient(${p.id})">✏️ Editar</button>
                    <button class="pc-btn delete" onclick="deletePatient(${p.id})">🗑️</button>
                </div>
            </div>`;
        }).join('');
    }

    // Search
    document.getElementById('search-pacientes').addEventListener('input', (e) => {
        renderPatients(e.target.value);
    });

    // Patient modal
    const modalPatient = document.getElementById('modal-paciente');
    document.getElementById('btn-open-patient-modal').addEventListener('click', () => {
        clearPatientForm();
        document.getElementById('modal-patient-title').textContent = 'Novo Paciente';
        modalPatient.classList.add('open');
    });

    document.getElementById('modal-patient-close').addEventListener('click', () => modalPatient.classList.remove('open'));
    document.getElementById('btn-cancel-patient').addEventListener('click', () => modalPatient.classList.remove('open'));
    modalPatient.addEventListener('click', (e) => { if (e.target === modalPatient) modalPatient.classList.remove('open'); });

    document.getElementById('btn-save-patient').addEventListener('click', () => {
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
            createdAt: editId ? patients.find(p => p.id === parseInt(editId))?.createdAt : new Date().toISOString()
        };

        if (editId) {
            const idx = patients.findIndex(p => p.id === parseInt(editId));
            if (idx >= 0) patients[idx] = data;
        } else {
            patients.push(data);
        }

        Store.set('patients', patients);
        modalPatient.classList.remove('open');
        renderPatients();
        refreshPatientSelects();
        showToast(editId ? 'Paciente atualizado!' : 'Paciente cadastrado!', 'success');
    });

    window.editPatient = function(id) {
        const p = patients.find(x => x.id === id);
        if (!p) return;
        document.getElementById('patient-edit-id').value = p.id;
        document.getElementById('p-nome').value = p.nome;
        document.getElementById('p-email').value = p.email || '';
        document.getElementById('p-telefone').value = p.telefone || '';
        document.getElementById('p-nascimento').value = p.nascimento || '';
        document.getElementById('p-sexo').value = p.sexo || '';
        document.getElementById('p-objetivo').value = p.objetivo || '';
        document.getElementById('p-peso').value = p.peso || '';
        document.getElementById('p-altura').value = p.altura || '';
        document.getElementById('p-alergias').value = p.alergias || '';
        document.getElementById('p-obs').value = p.obs || '';
        document.getElementById('modal-patient-title').textContent = 'Editar Paciente';
        modalPatient.classList.add('open');
    };

    window.deletePatient = function(id) {
        if (!confirm('Deseja realmente excluir este paciente?')) return;
        patients = patients.filter(p => p.id !== id);
        Store.set('patients', patients);
        renderPatients();
        refreshPatientSelects();
        showToast('Paciente removido.', 'info');
    };

    function clearPatientForm() {
        document.getElementById('patient-edit-id').value = '';
        ['p-nome','p-email','p-telefone','p-nascimento','p-sexo','p-objetivo','p-peso','p-altura','p-alergias','p-obs']
            .forEach(id => document.getElementById(id).value = '');
    }

    function refreshPatientSelects() {
        const selects = ['imc-paciente-select', 'diet-paciente-select', 'meal-paciente', 'tpl-apply-patient', 'evolucao-paciente', 'ag-paciente', 'tr-paciente', 'med-paciente', 'ex-paciente'];
        selects.forEach(selId => {
            const sel = document.getElementById(selId);
            if (!sel) return;
            const firstOption = sel.options[0].outerHTML;
            sel.innerHTML = firstOption + patients.map(p =>
                `<option value="${p.id}">${p.nome}</option>`
            ).join('');
        });
    }

    // ========== IMC CALCULATOR ==========
    function classifyIMC(imc) {
        if (imc < 18.5) return { label: 'Abaixo do peso', cssClass: 'abaixo', color: '#3b82f6',
            desc: 'O IMC está abaixo do ideal. Recomenda-se uma avaliação nutricional para ganho de peso saudável com aumento gradual da ingestão calórica.' };
        if (imc < 25) return { label: 'Peso normal', cssClass: 'normal', color: '#10b981',
            desc: 'Parabéns! O IMC está dentro da faixa saudável. Mantenha uma alimentação equilibrada e prática regular de atividade física.' };
        if (imc < 30) return { label: 'Sobrepeso', cssClass: 'sobrepeso', color: '#f59e0b',
            desc: 'IMC indica sobrepeso. Recomenda-se reeducação alimentar com redução de ultraprocessados e aumento da atividade física.' };
        if (imc < 35) return { label: 'Obesidade Grau I', cssClass: 'obesidade1', color: '#f97316',
            desc: 'Obesidade grau I identificada. Plano alimentar hipocalórico e acompanhamento multidisciplinar são recomendados.' };
        if (imc < 40) return { label: 'Obesidade Grau II', cssClass: 'obesidade2', color: '#ef4444',
            desc: 'Obesidade grau II. Acompanhamento médico e nutricional intensivo é essencial. Considerar avaliação endocrinológica.' };
        return { label: 'Obesidade Grau III', cssClass: 'obesidade3', color: '#dc2626',
            desc: 'Obesidade grau III (mórbida). Tratamento multidisciplinar urgente é necessário. Avaliar indicação cirúrgica.' };
    }

    // Patient select auto-fill
    document.getElementById('imc-paciente-select').addEventListener('change', (e) => {
        const p = patients.find(x => x.id === parseInt(e.target.value));
        if (p) {
            document.getElementById('imc-nome').value = p.nome;
            document.getElementById('imc-peso').value = p.peso || '';
            document.getElementById('imc-altura').value = p.altura || '';
            document.getElementById('imc-idade').value = p.nascimento ? calcAge(p.nascimento) : '';
            document.getElementById('imc-sexo').value = p.sexo || '';
        }
    });

    document.getElementById('btn-calc-imc').addEventListener('click', () => {
        const nome = document.getElementById('imc-nome').value.trim() || 'Paciente';
        const peso = parseFloat(document.getElementById('imc-peso').value);
        const altura = parseFloat(document.getElementById('imc-altura').value);
        const idade = parseInt(document.getElementById('imc-idade').value) || null;
        const sexo = document.getElementById('imc-sexo').value;

        if (!peso || !altura) { showToast('Preencha peso e altura.', 'error'); return; }
        if (peso < 20 || peso > 300) { showToast('Peso inválido (20-300 kg).', 'error'); return; }
        if (altura < 0.5 || altura > 2.5) { showToast('Altura inválida (0.5-2.5 m).', 'error'); return; }

        const imc = peso / (altura * altura);
        const cls = classifyIMC(imc);

        // Save to history
        imcHistory.push({ nome, peso, altura, idade, sexo, imc, date: new Date().toISOString() });
        Store.set('imc_history', imcHistory);
        imcCount++;
        Store.set('imc_count', imcCount);

        // Show result
        const card = document.getElementById('imc-result-card');
        card.style.display = 'block';

        document.getElementById('res-nome').textContent = nome;
        document.getElementById('res-data').textContent = formatDate(new Date().toISOString());

        // Animate circle
        animateIMCCircle(imc, cls.color);

        // Badge
        const badge = document.getElementById('imc-class-badge');
        badge.textContent = cls.label;
        badge.className = `imc-class-badge badge-${cls.cssClass}`;

        // Recommendation
        document.getElementById('imc-recommendation').textContent = cls.desc;

        // Bar pointer
        const barPercent = Math.min(100, Math.max(0, ((imc - 15) / (40 - 15)) * 100));
        document.getElementById('bar-pointer').style.left = `${barPercent}%`;

        // Details
        document.getElementById('res-peso').textContent = `${peso} kg`;
        document.getElementById('res-altura').textContent = `${altura} m`;

        const idealMin = (18.5 * altura * altura).toFixed(1);
        const idealMax = (24.9 * altura * altura).toFixed(1);
        document.getElementById('res-ideal').textContent = `${idealMin}–${idealMax} kg`;

        // TMB (Harris-Benedict)
        let tmb = '—';
        if (idade && sexo) {
            if (sexo === 'Masculino') {
                tmb = Math.round(88.362 + (13.397 * peso) + (4.799 * altura * 100) - (5.677 * idade)) + ' kcal';
            } else {
                tmb = Math.round(447.593 + (9.247 * peso) + (3.098 * altura * 100) - (4.330 * idade)) + ' kcal';
            }
        }
        document.getElementById('res-tmb').textContent = tmb;

        // History
        renderIMCHistory();

        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast(`IMC: ${imc.toFixed(1)} — ${cls.label}`, 'success');
    });

    function animateIMCCircle(imc, color) {
        const ring = document.getElementById('imc-progress-ring');
        const numEl = document.getElementById('imc-number');
        const circle = document.getElementById('imc-circle');
        const circumference = 326.7;

        // Map IMC to percentage (15-45 range)
        const percent = Math.min(1, Math.max(0, (imc - 15) / (45 - 15)));
        const offset = circumference * (1 - percent);

        circle.style.color = color;
        ring.style.stroke = color;

        // Animate
        const duration = 1000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            ring.setAttribute('stroke-dashoffset', circumference - (circumference - offset) * eased);
            numEl.textContent = (imc * eased).toFixed(1);

            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function renderIMCHistory() {
        const card = document.getElementById('imc-history-card');
        const table = document.getElementById('imc-history-table');

        if (imcHistory.length === 0) {
            card.style.display = 'none';
            return;
        }

        card.style.display = 'block';
        const recent = imcHistory.slice().reverse().slice(0, 10);

        table.innerHTML = recent.map(h => {
            const cls = classifyIMC(h.imc);
            return `
            <div class="imc-ht-row">
                <span class="imc-ht-name">${h.nome}</span>
                <span class="imc-ht-val">${h.imc.toFixed(1)}</span>
                <span class="imc-ht-class badge-${cls.cssClass}">${cls.label}</span>
                <span class="imc-ht-date">${formatDate(h.date)}</span>
                <button class="imc-ht-del" onclick="deleteIMCEntry('${h.date}')">✕</button>
            </div>`;
        }).join('');
    }

    window.deleteIMCEntry = function(date) {
        imcHistory = imcHistory.filter(h => h.date !== date);
        Store.set('imc_history', imcHistory);
        imcCount = Math.max(0, imcCount - 1);
        Store.set('imc_count', imcCount);
        renderIMCHistory();
    };

    document.getElementById('btn-clear-imc-history').addEventListener('click', () => {
        if (!confirm('Limpar todo o histórico de IMC?')) return;
        imcHistory = [];
        Store.set('imc_history', imcHistory);
        imcCount = 0;
        Store.set('imc_count', imcCount);
        renderIMCHistory();
        showToast('Histórico limpo.', 'info');
    });

    function refreshIMCView() {
        refreshPatientSelects();
        renderIMCHistory();
    }

    // ========== DIET PLAN ==========
    let currentDayFilter = 'all';
    let currentDietPatientFilter = '';

    const modalMeal = document.getElementById('modal-refeicao');
    document.getElementById('btn-open-meal-modal').addEventListener('click', () => {
        refreshPatientSelects();
        modalMeal.classList.add('open');
    });
    document.getElementById('modal-meal-close').addEventListener('click', () => modalMeal.classList.remove('open'));
    document.getElementById('btn-cancel-meal').addEventListener('click', () => modalMeal.classList.remove('open'));
    modalMeal.addEventListener('click', (e) => { if (e.target === modalMeal) modalMeal.classList.remove('open'); });

    document.getElementById('btn-save-meal').addEventListener('click', () => {
        const tipo = document.getElementById('meal-tipo').value;
        const alimentos = document.getElementById('meal-alimentos').value.trim();

        if (!tipo) { showToast('Selecione o tipo de refeição.', 'error'); return; }
        if (!alimentos) { showToast('Descreva os alimentos.', 'error'); return; }

        const pacienteId = document.getElementById('meal-paciente').value;
        const paciente = pacienteId ? patients.find(p => p.id === parseInt(pacienteId)) : null;

        const meal = {
            id: Date.now(),
            paciente: paciente ? paciente.nome : 'Geral',
            pacienteId: pacienteId ? parseInt(pacienteId) : null,
            dia: document.getElementById('meal-dia').value,
            tipo,
            horario: document.getElementById('meal-horario').value,
            alimentos,
            calorias: parseInt(document.getElementById('meal-cal').value) || 0,
            proteinas: parseInt(document.getElementById('meal-prot').value) || 0,
            carboidratos: parseInt(document.getElementById('meal-carb').value) || 0,
            gorduras: parseInt(document.getElementById('meal-fat').value) || 0,
            obs: document.getElementById('meal-obs').value.trim(),
            createdAt: new Date().toISOString()
        };

        meals.push(meal);
        Store.set('meals', meals);
        modalMeal.classList.remove('open');
        clearMealForm();
        renderMeals();
        showToast(`${tipo} adicionada!`, 'success');
    });

    function clearMealForm() {
        ['meal-tipo','meal-horario','meal-alimentos','meal-cal','meal-prot','meal-carb','meal-fat','meal-obs','meal-dia']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            });
    }

    // Day tabs
    document.getElementById('day-tabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('day-tab')) {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentDayFilter = e.target.dataset.day;
            renderMeals();
        }
    });

    // Diet patient filter
    document.getElementById('diet-paciente-select').addEventListener('change', (e) => {
        currentDietPatientFilter = e.target.value;
        renderMeals();
    });

    function renderMeals() {
        let filtered = meals;

        if (currentDayFilter !== 'all') {
            filtered = filtered.filter(m => m.dia === currentDayFilter || m.dia === 'all');
        }
        if (currentDietPatientFilter) {
            filtered = filtered.filter(m => m.pacienteId === parseInt(currentDietPatientFilter));
        }

        const timeline = document.getElementById('meals-timeline');
        const summary = document.getElementById('macro-summary');
        const chartContainer = document.getElementById('macro-chart-container');

        if (filtered.length === 0) {
            timeline.innerHTML = `<div class="empty-state">
                <div class="empty-icon">🥗</div>
                <h3>Nenhuma refeição encontrada</h3>
                <p>Clique em "Nova Refeição" para montar o plano alimentar.</p>
            </div>`;
            summary.style.display = 'none';
            chartContainer.style.display = 'none';
            return;
        }

        // Sort by time
        filtered.sort((a, b) => (a.horario || '').localeCompare(b.horario || ''));

        summary.style.display = 'grid';

        const totals = filtered.reduce((acc, m) => ({
            cal: acc.cal + m.calorias,
            prot: acc.prot + m.proteinas,
            carb: acc.carb + m.carboidratos,
            fat: acc.fat + m.gorduras
        }), { cal: 0, prot: 0, carb: 0, fat: 0 });

        document.getElementById('m-cal').textContent = totals.cal;
        document.getElementById('m-prot').textContent = totals.prot;
        document.getElementById('m-carb').textContent = totals.carb;
        document.getElementById('m-fat').textContent = totals.fat;

        // Draw chart
        if (totals.prot + totals.carb + totals.fat > 0) {
            chartContainer.style.display = 'flex';
            drawMacroChart(totals);
        } else {
            chartContainer.style.display = 'none';
        }

        const dayLabels = { all: 'Todos', seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' };

        timeline.innerHTML = filtered.map((m, i) => `
            <div class="meal-card" style="animation-delay:${i * 0.04}s">
                <div class="meal-time-col">
                    ${m.horario ? `<span class="meal-time-badge">${m.horario}</span>` : '<span class="meal-time-badge">—</span>'}
                    <span class="meal-day-badge">${dayLabels[m.dia] || ''}</span>
                    <div class="meal-time-line"></div>
                </div>
                <div class="meal-body">
                    <div class="meal-header">
                        <span class="meal-title">${m.tipo}</span>
                        <span class="meal-patient-tag">👤 ${m.paciente}</span>
                    </div>
                    <div class="meal-desc">${m.alimentos.replace(/\n/g, '<br>')}</div>
                    <div class="meal-macros">
                        ${m.calorias ? `<span class="macro-chip cal">🔥 ${m.calorias} kcal</span>` : ''}
                        ${m.proteinas ? `<span class="macro-chip prot">💪 ${m.proteinas}g</span>` : ''}
                        ${m.carboidratos ? `<span class="macro-chip carb">🌾 ${m.carboidratos}g</span>` : ''}
                        ${m.gorduras ? `<span class="macro-chip fat">🫒 ${m.gorduras}g</span>` : ''}
                    </div>
                    ${m.obs ? `<div class="meal-obs">📌 ${m.obs}</div>` : ''}
                    <div class="meal-actions">
                        <button class="meal-btn delete" onclick="deleteMeal(${m.id})">🗑️ Remover</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.deleteMeal = function(id) {
        meals = meals.filter(m => m.id !== id);
        Store.set('meals', meals);
        renderMeals();
        showToast('Refeição removida.', 'info');
    };

    // Macro donut chart
    function drawMacroChart(totals) {
        const canvas = document.getElementById('macro-chart');
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 180 * dpr;
        canvas.height = 180 * dpr;
        ctx.scale(dpr, dpr);

        const cx = 90, cy = 90, radius = 65, lineWidth = 20;
        const total = totals.prot + totals.carb + totals.fat;
        if (total === 0) return;

        const segments = [
            { label: 'Proteína', value: totals.prot, color: '#3b82f6' },
            { label: 'Carboidrato', value: totals.carb, color: '#f59e0b' },
            { label: 'Gordura', value: totals.fat, color: '#8b5cf6' },
        ];

        ctx.clearRect(0, 0, 180, 180);

        let startAngle = -Math.PI / 2;
        segments.forEach(seg => {
            const sliceAngle = (seg.value / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.strokeStyle = seg.color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
            startAngle += sliceAngle + 0.04;
        });

        // Center text
        ctx.fillStyle = currentTheme === 'dark' ? '#f1f5f9' : '#0f172a';
        ctx.font = '700 22px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(`${totals.cal}`, cx, cy - 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 11px Inter';
        ctx.fillText('kcal total', cx, cy + 14);

        // Legend
        const legend = document.getElementById('chart-legend');
        legend.innerHTML = segments.map(s => {
            const pct = ((s.value / total) * 100).toFixed(0);
            return `<div class="legend-item">
                <span class="legend-dot" style="background:${s.color}"></span>
                <span>${s.label}</span>
                <span class="legend-val">${s.value}g (${pct}%)</span>
            </div>`;
        }).join('');
    }

    // Export
    document.getElementById('btn-export-diet').addEventListener('click', () => {
        if (meals.length === 0) { showToast('Nenhuma refeição para exportar.', 'error'); return; }

        const dayLabels = { all: 'Todos os dias', seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };
        const date = new Date().toLocaleDateString('pt-BR');
        const totals = meals.reduce((acc, m) => ({ cal: acc.cal + m.calorias, prot: acc.prot + m.proteinas, carb: acc.carb + m.carboidratos, fat: acc.fat + m.gorduras }), { cal: 0, prot: 0, carb: 0, fat: 0 });

        let text = `╔══════════════════════════════════════════╗\n`;
        text += `║       🥗 LO DIET — Plano Alimentar       ║\n`;
        text += `╚══════════════════════════════════════════╝\n\n`;
        text += `📅 Data: ${date}\n\n`;

        const grouped = {};
        meals.forEach(m => {
            const key = m.dia || 'all';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(m);
        });

        Object.entries(grouped).forEach(([day, dayMeals]) => {
            text += `━━━ ${dayLabels[day] || day} ━━━\n\n`;
            dayMeals.forEach(m => {
                text += `  ${m.tipo}${m.horario ? ` (${m.horario})` : ''}\n`;
                text += `  👤 ${m.paciente}\n`;
                text += `  ${m.alimentos}\n`;
                const macros = [];
                if (m.calorias) macros.push(`${m.calorias} kcal`);
                if (m.proteinas) macros.push(`${m.proteinas}g P`);
                if (m.carboidratos) macros.push(`${m.carboidratos}g C`);
                if (m.gorduras) macros.push(`${m.gorduras}g G`);
                if (macros.length) text += `  → ${macros.join(' | ')}\n`;
                if (m.obs) text += `  📌 ${m.obs}\n`;
                text += `\n`;
            });
        });

        text += `──────────────────────────────────────────\n`;
        text += `📊 TOTAIS: ${totals.cal} kcal | ${totals.prot}g P | ${totals.carb}g C | ${totals.fat}g G\n`;
        text += `──────────────────────────────────────────\n`;
        text += `Gerado por LoDiet — ${date}\n`;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plano-dieta-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Plano exportado!', 'success');
    });

    function refreshDietView() {
        refreshPatientSelects();
        renderMeals();
        renderRecCards();
    }

    // ========== WATER TRACKER ==========
    function getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    function getTodayWater() {
        return waterLog.filter(w => w.date === getTodayKey());
    }

    function getTodayWaterTotal() {
        return getTodayWater().reduce((sum, w) => sum + w.amount, 0);
    }

    function refreshWaterView() {
        const total = getTodayWaterTotal();
        const goal = waterGoal;
        const percent = Math.min(100, (total / goal) * 100);

        document.getElementById('water-fill').style.height = `${percent}%`;
        document.getElementById('water-percent').textContent = `${Math.round(percent)}%`;
        document.getElementById('water-current').textContent = total;
        document.getElementById('water-goal-display').textContent = goal;
        document.getElementById('water-goal-input').value = goal;

        const remaining = Math.max(0, goal - total);
        document.getElementById('water-remaining').textContent =
            remaining > 0 ? `Faltam ${remaining} ml` : '🎉 Meta atingida!';

        // Log
        const logEl = document.getElementById('water-log');
        const todayEntries = getTodayWater().reverse();

        if (todayEntries.length === 0) {
            logEl.innerHTML = '<div class="empty-small">Nenhum registro ainda hoje.</div>';
        } else {
            logEl.innerHTML = todayEntries.map(w => `
                <div class="water-log-item">
                    <span class="water-log-amount">💧 ${w.amount} ml</span>
                    <span class="water-log-time">${w.time}</span>
                </div>
            `).join('');
        }
    }

    function addWater(amount) {
        if (!amount || amount <= 0) return;

        waterLog.push({
            date: getTodayKey(),
            amount,
            time: formatTime(new Date())
        });

        Store.set('water_log', waterLog);
        refreshWaterView();
        showToast(`+${amount}ml adicionado!`, 'success');
    }

    document.querySelectorAll('.water-btn').forEach(btn => {
        btn.addEventListener('click', () => addWater(parseInt(btn.dataset.amount)));
    });

    document.getElementById('btn-add-water').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('water-custom-amount').value);
        if (!amount) { showToast('Informe a quantidade.', 'error'); return; }
        addWater(amount);
        document.getElementById('water-custom-amount').value = '';
    });

    document.getElementById('btn-set-water-goal').addEventListener('click', () => {
        const goal = parseInt(document.getElementById('water-goal-input').value);
        if (!goal || goal < 500) { showToast('Meta mínima: 500ml', 'error'); return; }
        waterGoal = goal;
        Store.set('water_goal', waterGoal);
        refreshWaterView();
        showToast(`Meta definida: ${goal}ml`, 'success');
    });

    document.getElementById('btn-reset-water').addEventListener('click', () => {
        if (!confirm('Resetar registros de água de hoje?')) return;
        const todayKey = getTodayKey();
        waterLog = waterLog.filter(w => w.date !== todayKey);
        Store.set('water_log', waterLog);
        refreshWaterView();
        showToast('Registros resetados.', 'info');
    });

    // ========== NOTES ==========
    const modalNote = document.getElementById('modal-nota');
    let currentNoteColor = 'default';

    document.getElementById('btn-add-note').addEventListener('click', () => {
        clearNoteForm();
        document.getElementById('modal-note-title').textContent = 'Nova Nota';
        modalNote.classList.add('open');
    });

    document.getElementById('modal-note-close').addEventListener('click', () => modalNote.classList.remove('open'));
    document.getElementById('btn-cancel-note').addEventListener('click', () => modalNote.classList.remove('open'));
    modalNote.addEventListener('click', (e) => { if (e.target === modalNote) modalNote.classList.remove('open'); });

    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            currentNoteColor = dot.dataset.color;
        });
    });

    document.getElementById('btn-save-note').addEventListener('click', () => {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();

        if (!title && !content) { showToast('Escreva algo na nota.', 'error'); return; }

        const editId = document.getElementById('note-edit-id').value;
        const note = {
            id: editId ? parseInt(editId) : Date.now(),
            title: title || 'Sem título',
            content,
            color: currentNoteColor,
            createdAt: editId ? notes.find(n => n.id === parseInt(editId))?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (editId) {
            const idx = notes.findIndex(n => n.id === parseInt(editId));
            if (idx >= 0) notes[idx] = note;
        } else {
            notes.push(note);
        }

        Store.set('notes', notes);
        modalNote.classList.remove('open');
        renderNotes();
        showToast(editId ? 'Nota atualizada!' : 'Nota criada!', 'success');
    });

    function clearNoteForm() {
        document.getElementById('note-edit-id').value = '';
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        currentNoteColor = 'default';
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        document.querySelector('.color-dot[data-color="default"]').classList.add('active');
    }

    function renderNotes() {
        const grid = document.getElementById('notes-grid');

        if (notes.length === 0) {
            grid.innerHTML = `<div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>Nenhuma anotação</h3>
                <p>Crie notas para organizar suas ideias e lembretes.</p>
            </div>`;
            return;
        }

        grid.innerHTML = notes.slice().reverse().map((n, i) => `
            <div class="note-card${n.color !== 'default' ? ` color-${n.color}` : ''}" style="animation-delay:${i * 0.04}s">
                <div class="note-title">${n.title}</div>
                <div class="note-content">${n.content.replace(/\n/g, '<br>')}</div>
                <div class="note-footer">
                    <span class="note-date">${formatDate(n.updatedAt || n.createdAt)}</span>
                    <div class="note-actions">
                        <button class="note-btn" onclick="editNote(${n.id})">✏️</button>
                        <button class="note-btn delete" onclick="deleteNote(${n.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.editNote = function(id) {
        const n = notes.find(x => x.id === id);
        if (!n) return;
        document.getElementById('note-edit-id').value = n.id;
        document.getElementById('note-title').value = n.title;
        document.getElementById('note-content').value = n.content;
        currentNoteColor = n.color || 'default';
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        const target = document.querySelector(`.color-dot[data-color="${currentNoteColor}"]`);
        if (target) target.classList.add('active');
        document.getElementById('modal-note-title').textContent = 'Editar Nota';
        modalNote.classList.add('open');
    };

    window.deleteNote = function(id) {
        if (!confirm('Excluir esta nota?')) return;
        notes = notes.filter(n => n.id !== id);
        Store.set('notes', notes);
        renderNotes();
        showToast('Nota removida.', 'info');
    };

    // ========== RECOMMENDED DIETS ==========
    let recDietsOpen = false;
    let currentTemplate = null;
    let currentTplDay = 'seg';

    window.toggleRecDiets = function() {
        recDietsOpen = !recDietsOpen;
        const grid = document.getElementById('rec-cards-grid');
        const btn = document.getElementById('btn-toggle-rec');
        grid.style.display = recDietsOpen ? 'grid' : 'none';
        btn.textContent = recDietsOpen ? 'Ocultar ▲' : 'Mostrar ▼';
        if (recDietsOpen) renderRecCards();
    };

    function renderRecCards() {
        const grid = document.getElementById('rec-cards-grid');
        if (!grid || !window.DIET_TEMPLATES) return;

        const templates = Object.values(DIET_TEMPLATES);
        grid.innerHTML = templates.map((tpl, i) => `
            <div class="rec-card" style="--card-accent: ${tpl.color}; background: ${tpl.colorBg}; animation-delay: ${i * 0.06}s" onclick="openTemplate('${tpl.id}')">
                <div class="rec-card-icon">${tpl.icon}</div>
                <div class="rec-card-name">${tpl.name}</div>
                <div class="rec-card-cal">${tpl.dailyCal}</div>
                <div class="rec-card-desc">${tpl.description}</div>
                <div class="rec-card-footer">
                    <span class="rec-card-macros">${tpl.macroSplit}</span>
                    <button class="rec-card-btn" style="color:${tpl.color}">Ver plano →</button>
                </div>
            </div>
        `).join('');
    }

    // Template modal
    const modalTemplate = document.getElementById('modal-template');
    document.getElementById('modal-template-close').addEventListener('click', () => modalTemplate.classList.remove('open'));
    document.getElementById('btn-close-template').addEventListener('click', () => modalTemplate.classList.remove('open'));
    modalTemplate.addEventListener('click', (e) => { if (e.target === modalTemplate) modalTemplate.classList.remove('open'); });

    window.openTemplate = function(id) {
        if (!DIET_TEMPLATES[id]) return;
        currentTemplate = DIET_TEMPLATES[id];
        currentTplDay = 'seg';

        document.getElementById('tpl-modal-title').textContent = `${currentTemplate.icon} ${currentTemplate.name}`;

        // Info header
        document.getElementById('tpl-info').innerHTML = `
            <div class="tpl-info" style="background: ${currentTemplate.colorBg}">
                <div class="tpl-info-icon">${currentTemplate.icon}</div>
                <div class="tpl-info-text">
                    <h4>${currentTemplate.name}</h4>
                    <div class="tpl-info-meta">
                        <span>🔥 ${currentTemplate.dailyCal}</span>
                        <span>📊 ${currentTemplate.macroSplit}</span>
                    </div>
                    <p class="tpl-desc">${currentTemplate.description}</p>
                </div>
            </div>
        `;

        // Tips
        document.getElementById('tpl-tips').innerHTML = currentTemplate.tips.map(t =>
            `<span class="tpl-tip">${t}</span>`
        ).join('');

        // Day tabs
        renderTplDayTabs();
        renderTplDayMeals();

        refreshPatientSelects();
        modalTemplate.classList.add('open');
    };

    const dayNames = { seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };

    function renderTplDayTabs() {
        const tabs = document.getElementById('tpl-day-tabs');
        tabs.innerHTML = Object.entries(dayNames).map(([key, label]) =>
            `<button class="tpl-day-tab ${key === currentTplDay ? 'active' : ''}" data-tplday="${key}">${label}</button>`
        ).join('');

        tabs.querySelectorAll('.tpl-day-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentTplDay = tab.dataset.tplday;
                tabs.querySelectorAll('.tpl-day-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderTplDayMeals();
            });
        });
    }

    function renderTplDayMeals() {
        if (!currentTemplate) return;
        const dayMeals = currentTemplate.days[currentTplDay] || [];
        const list = document.getElementById('tpl-meals-list');
        const totalsEl = document.getElementById('tpl-day-totals');

        list.innerHTML = dayMeals.map((m, i) => `
            <div class="tpl-meal" style="animation-delay: ${i * 0.04}s">
                <div class="tpl-meal-time">
                    <span class="tpl-meal-hour">${m.horario}</span>
                </div>
                <div class="tpl-meal-body">
                    <div class="tpl-meal-tipo">${m.tipo}</div>
                    <div class="tpl-meal-alimentos">${m.alimentos}</div>
                    <div class="tpl-meal-macros">
                        ${m.calorias ? `<span class="tpl-macro-chip cal">🔥 ${m.calorias} kcal</span>` : ''}
                        ${m.proteinas ? `<span class="tpl-macro-chip prot">💪 ${m.proteinas}g P</span>` : ''}
                        ${m.carboidratos ? `<span class="tpl-macro-chip carb">🌾 ${m.carboidratos}g C</span>` : ''}
                        ${m.gorduras ? `<span class="tpl-macro-chip fat">🫒 ${m.gorduras}g G</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Day totals
        const totals = dayMeals.reduce((acc, m) => ({
            cal: acc.cal + (m.calorias || 0),
            prot: acc.prot + (m.proteinas || 0),
            carb: acc.carb + (m.carboidratos || 0),
            fat: acc.fat + (m.gorduras || 0)
        }), { cal: 0, prot: 0, carb: 0, fat: 0 });

        totalsEl.innerHTML = `
            <div class="tpl-total-item"><span class="tpl-total-val" style="color:#f97316">${totals.cal}</span><span class="tpl-total-lbl">kcal</span></div>
            <div class="tpl-total-item"><span class="tpl-total-val" style="color:#3b82f6">${totals.prot}g</span><span class="tpl-total-lbl">proteína</span></div>
            <div class="tpl-total-item"><span class="tpl-total-val" style="color:#f59e0b">${totals.carb}g</span><span class="tpl-total-lbl">carboidrato</span></div>
            <div class="tpl-total-item"><span class="tpl-total-val" style="color:#8b5cf6">${totals.fat}g</span><span class="tpl-total-lbl">gordura</span></div>
        `;
    }

    // Apply template
    document.getElementById('btn-apply-template').addEventListener('click', () => {
        if (!currentTemplate) return;

        const patientId = document.getElementById('tpl-apply-patient').value;
        const patient = patientId ? patients.find(p => p.id === parseInt(patientId)) : null;
        const patientName = patient ? patient.nome : 'Geral';

        if (!confirm(`Aplicar o plano "${currentTemplate.name}" (7 dias completos) para ${patientName}?\n\nIsso adicionará todas as refeições ao seu plano de dieta.`)) return;

        let count = 0;
        Object.entries(currentTemplate.days).forEach(([day, dayMeals]) => {
            dayMeals.forEach(m => {
                meals.push({
                    id: Date.now() + count,
                    paciente: patientName,
                    pacienteId: patientId ? parseInt(patientId) : null,
                    dia: day,
                    tipo: m.tipo,
                    horario: m.horario,
                    alimentos: m.alimentos,
                    calorias: m.calorias || 0,
                    proteinas: m.proteinas || 0,
                    carboidratos: m.carboidratos || 0,
                    gorduras: m.gorduras || 0,
                    obs: `Plano: ${currentTemplate.name}`,
                    createdAt: new Date().toISOString()
                });
                count++;
            });
        });

        Store.set('meals', meals);
        modalTemplate.classList.remove('open');
        renderMeals();
        showToast(`✅ ${count} refeições do plano "${currentTemplate.name}" aplicadas para ${patientName}!`, 'success');
    });

    // ========== DARK MODE ==========
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            htmlEl.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            Store.set('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // ========== EVOLUÇÃO ==========
    const evoPaciente = document.getElementById('evolucao-paciente');
    if (evoPaciente) {
        evoPaciente.addEventListener('change', renderEvolucaoData);
    }
    const btnAddPeso = document.getElementById('btn-add-peso');
    if (btnAddPeso) {
        btnAddPeso.addEventListener('click', () => {
            const pid = parseInt(evoPaciente.value);
            if (!pid) { showToast('Selecione um paciente.', 'error'); return; }
            const dateStr = document.getElementById('evo-data').value;
            const peso = parseFloat(document.getElementById('evo-peso').value);
            
            if (!dateStr || !peso) { showToast('Preencha data e peso.', 'error'); return; }
            const p = patients.find(x => x.id === pid);
            if (!p) { showToast('Paciente não encontrado.', 'error'); return; }
            
            weightRecords.push({ id: Date.now(), patientId: pid, patientName: p.nome, date: dateStr, weight: peso });
            weightRecords.sort((a,b) => a.date.localeCompare(b.date));
            Store.set('weight_records', weightRecords);
            
            document.getElementById('evo-data').value = '';
            document.getElementById('evo-peso').value = '';
            showToast('Peso registrado.', 'success');
            renderEvolucaoData();
        });
    }

    function renderEvolucaoData() {
        const pid = parseInt(document.getElementById('evolucao-paciente').value);
        const histContainer = document.getElementById('evo-history');
        const statsEl = document.getElementById('evo-stats');
        
        if (!pid) {
            histContainer.innerHTML = '<div class="empty-small">Selecione um paciente para ver o histórico.</div>';
            statsEl.style.display = 'none';
            drawEvoChart([]);
            return;
        }

        let records = weightRecords.filter(r => r.patientId === pid);
        if (records.length === 0) {
            histContainer.innerHTML = '<div class="empty-small">Nenhum registro para este paciente.</div>';
            statsEl.style.display = 'none';
            drawEvoChart([]);
            return;
        }

        statsEl.style.display = 'flex';
        const weights = records.map(r => r.weight);
        document.getElementById('evo-stat-min').textContent = Math.min(...weights).toFixed(1) + ' kg';
        document.getElementById('evo-stat-max').textContent = Math.max(...weights).toFixed(1) + ' kg';
        const avg = weights.reduce((a,b) => a + b, 0) / weights.length;
        document.getElementById('evo-stat-avg').textContent = avg.toFixed(1) + ' kg';

        histContainer.innerHTML = records.slice().reverse().map(r => `
            <div class="evo-hist-item">
                <div class="evo-hist-left">
                    <span class="evo-hist-date">${formatDate(r.date)}</span>
                    <span class="evo-hist-peso">${r.weight.toFixed(1)} kg</span>
                </div>
                <button class="evo-hist-del" onclick="deleteWeightRecord(${r.id})">✕</button>
            </div>
        `).join('');

        drawEvoChart(records);
    }

    window.deleteWeightRecord = function(id) {
        weightRecords = weightRecords.filter(r => r.id !== id);
        Store.set('weight_records', weightRecords);
        renderEvolucaoData();
    };

    function drawEvoChart(records) {
        const canvas = document.getElementById('evo-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0,0,W,H);
        
        if (records.length < 2) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Adicione pelo menos 2 registros para ver o gráfico.', W/2, H/2);
            return;
        }

        const weights = records.map(r => r.weight);
        const minW = Math.min(...weights) - 2;
        const maxW = Math.max(...weights) + 2;
        const range = maxW - minW;
        
        const padX = 40, padY = 30;
        const wSpace = (W - padX*2) / (records.length - 1);
        
        ctx.beginPath();
        records.forEach((r, i) => {
            const x = padX + i * wSpace;
            const y = H - padY - ((r.weight - minW) / range) * (H - padY*2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        records.forEach((r, i) => {
            const x = padX + i * wSpace;
            const y = H - padY - ((r.weight - minW) / range) * (H - padY*2);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI*2);
            ctx.fillStyle = '#10b981';
            ctx.fill();
            ctx.fillStyle = currentTheme === 'dark' ? '#f1f5f9' : '#0f172a';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(r.weight.toFixed(1), x, y - 10);
            
            const dateStr = new Date(r.date + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});
            ctx.fillText(dateStr, x, H - 10);
        });
    }

    function refreshEvolucaoView() {
        refreshPatientSelects();
        renderEvolucaoData();
    }

    // ========== LISTA DE COMPRAS ==========
    const modalCompras = document.getElementById('modal-lista-compras');
    const btnListaCompras = document.getElementById('btn-lista-compras');
    if (btnListaCompras) {
        btnListaCompras.addEventListener('click', () => {
            const listEl = document.getElementById('compras-list');
            let filtered = meals;
            if (currentDietPatientFilter) {
                filtered = filtered.filter(m => m.pacienteId === parseInt(currentDietPatientFilter));
            }
            if (filtered.length === 0) {
                listEl.innerHTML = '<div class="empty-small">Nenhuma refeição encontrada para gerar lista.</div>';
            } else {
                let allItems = [];
                filtered.forEach(m => {
                    const lines = m.alimentos.split('\n');
                    lines.forEach(l => {
                        let text = l.trim();
                        if (text.startsWith('-') || text.startsWith('•')) text = text.substring(1).trim();
                        if (text) allItems.push(text);
                    });
                });
                
                // Categorize
                const categories = {
                    '🥩 Proteínas': ['frango', 'carne', 'ovo', 'ovos', 'peixe', 'salmão', 'tilápia', 'atum', 'bife', 'patinho', 'whey'],
                    '🥬 Vegetais & Folhas': ['alface', 'tomate', 'cebola', 'alho', 'cenoura', 'brócolis', 'couve', 'espinafre', 'abobrinha', 'batata'],
                    '🍎 Frutas': ['banana', 'maçã', 'laranja', 'limão', 'mamão', 'uva', 'morango', 'abacate', 'melancia'],
                    '🌾 Cereais & Grãos': ['arroz', 'feijão', 'aveia', 'pão', 'macarrão', 'tapioca', 'grão de bico', 'milho', 'lentilha', 'quinoa'],
                    '🥛 Laticínios': ['leite', 'queijo', 'iogurte', 'manteiga', 'requeijão', 'creme de leite'],
                    '🧴 Outros': []
                };
                
                let categorized = {};
                Object.keys(categories).forEach(c => categorized[c] = []);
                
                allItems.forEach(item => {
                    let cat = '🧴 Outros';
                    const lower = item.toLowerCase();
                    for (const [cName, keywords] of Object.entries(categories)) {
                        if (cName === '🧴 Outros') continue;
                        if (keywords.some(kw => lower.includes(kw))) {
                            cat = cName;
                            break;
                        }
                    }
                    categorized[cat].push(item);
                });
                
                let html = '';
                let idCount = 0;
                Object.keys(categorized).forEach(c => {
                    let items = [...new Set(categorized[c])];
                    if (items.length > 0) {
                        html += `<div class="compras-cat">${c}</div>`;
                        items.forEach(it => {
                            idCount++;
                            html += `<div class="compras-item"><input type="checkbox" id="ci-${idCount}"><label for="ci-${idCount}">${it}</label></div>`;
                        });
                    }
                });
                listEl.innerHTML = html;
            }
            modalCompras.classList.add('open');
        });
    }

    if (document.getElementById('modal-compras-close')) {
        document.getElementById('modal-compras-close').addEventListener('click', () => modalCompras.classList.remove('open'));
        document.getElementById('btn-close-compras').addEventListener('click', () => modalCompras.classList.remove('open'));
        modalCompras.addEventListener('click', (e) => { if (e.target === modalCompras) modalCompras.classList.remove('open'); });
    }

    const btnCopy = document.getElementById('btn-copy-compras');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const listEl = document.getElementById('compras-list');
            let text = '🛒 Lista de Compras:\n\n';
            listEl.querySelectorAll('.compras-cat').forEach(cat => {
                text += `\n[ ${cat.textContent} ]\n`;
                let node = cat.nextElementSibling;
                while(node && node.classList.contains('compras-item')) {
                    const label = node.querySelector('label').textContent;
                    text += `- ${label}\n`;
                    node = node.nextElementSibling;
                }
            });
            navigator.clipboard.writeText(text).then(() => {
                showToast('Lista copiada!', 'success');
            }).catch(() => showToast('Não foi possível copiar.', 'error'));
        });
    }

    // ========== AGENDA ==========
    let currentAgendaDate = new Date();
    const modalAgenda = document.getElementById('modal-agenda');
    
    if (document.getElementById('btn-open-agenda')) {
        document.getElementById('btn-open-agenda').addEventListener('click', () => {
            refreshPatientSelects();
            document.getElementById('agenda-edit-id').value = '';
            document.getElementById('ag-paciente').value = '';
            document.getElementById('ag-data').value = '';
            document.getElementById('ag-hora').value = '';
            document.getElementById('ag-tipo').selectedIndex = 0;
            document.getElementById('ag-status').selectedIndex = 0;
            document.getElementById('ag-obs').value = '';
            document.getElementById('agenda-modal-title').textContent = 'Nova Consulta';
            modalAgenda.classList.add('open');
        });
    }

    if (document.getElementById('modal-agenda-close')) {
        document.getElementById('modal-agenda-close').addEventListener('click', () => modalAgenda.classList.remove('open'));
        document.getElementById('btn-cancel-agenda').addEventListener('click', () => modalAgenda.classList.remove('open'));
        modalAgenda.addEventListener('click', (e) => { if (e.target === modalAgenda) modalAgenda.classList.remove('open'); });
    }

    if (document.getElementById('btn-save-agenda')) {
        document.getElementById('btn-save-agenda').addEventListener('click', () => {
            const pid = parseInt(document.getElementById('ag-paciente').value);
            const dataStr = document.getElementById('ag-data').value;
            const hora = document.getElementById('ag-hora').value;
            
            if (!pid || !dataStr || !hora) { showToast('Preencha paciente, data e hora.', 'error'); return; }
            
            const p = patients.find(x => x.id === pid);
            if (!p) { showToast('Paciente não encontrado.', 'error'); return; }
            const editId = document.getElementById('agenda-edit-id').value;
            
            const apt = {
                id: editId ? parseInt(editId) : Date.now(),
                patientId: pid,
                patientName: p.nome,
                date: dataStr,
                time: hora,
                type: document.getElementById('ag-tipo').value,
                status: document.getElementById('ag-status').value,
                notes: document.getElementById('ag-obs').value
            };
            
            if (editId) {
                const idx = appointments.findIndex(a => a.id === parseInt(editId));
                if (idx >= 0) appointments[idx] = apt;
            } else {
                appointments.push(apt);
            }
            
            Store.set('appointments', appointments);
            modalAgenda.classList.remove('open');
            showToast(editId ? 'Consulta atualizada.' : 'Consulta agendada.', 'success');
            refreshAgendaView();
        });
    }

    if (document.getElementById('btn-cal-prev')) {
        document.getElementById('btn-cal-prev').addEventListener('click', () => {
            currentAgendaDate.setMonth(currentAgendaDate.getMonth() - 1);
            renderCalendar();
        });
        document.getElementById('btn-cal-next').addEventListener('click', () => {
            currentAgendaDate.setMonth(currentAgendaDate.getMonth() + 1);
            renderCalendar();
        });
    }

    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        
        const year = currentAgendaDate.getFullYear();
        const month = currentAgendaDate.getMonth();
        
        const monthsNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        document.getElementById('cal-month-year').textContent = `${monthsNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = '';
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="cal-day empty"></div>`;
        }
        
        const todayStr = new Date().toISOString().split('T')[0];
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            const isToday = dateStr === todayStr;
            const dayApts = appointments.filter(a => a.date === dateStr);
            
            let dots = '';
            dayApts.slice(0, 3).forEach(a => {
                let color = 'var(--accent)';
                if (a.status === 'Remarcada') color = 'var(--amber)';
                if (a.status === 'Faltou') color = 'var(--red)';
                dots += `<div class="cal-dot" style="background:${color}"></div>`;
            });
            
            html += `
                <div class="cal-day ${isToday ? 'today' : ''}" onclick="selectAgendaDate('${dateStr}')">
                    <div class="cal-day-num">${i}</div>
                    <div class="cal-dots">${dots}</div>
                </div>
            `;
        }
        grid.innerHTML = html;
        renderUpcomingAppointments();
    }

    window.selectAgendaDate = function(dateStr) {
        refreshPatientSelects();
        document.getElementById('agenda-edit-id').value = '';
        document.getElementById('ag-paciente').value = '';
        document.getElementById('ag-data').value = dateStr;
        document.getElementById('ag-hora').value = '';
        document.getElementById('ag-tipo').selectedIndex = 0;
        document.getElementById('ag-status').selectedIndex = 0;
        document.getElementById('ag-obs').value = '';
        document.getElementById('agenda-modal-title').textContent = 'Nova Consulta';
        modalAgenda.classList.add('open');
    }

    window.editAppointment = function(id) {
        const a = appointments.find(x => x.id === id);
        if (!a) return;
        refreshPatientSelects();
        document.getElementById('agenda-edit-id').value = a.id;
        document.getElementById('ag-paciente').value = a.patientId;
        document.getElementById('ag-data').value = a.date;
        document.getElementById('ag-hora').value = a.time;
        document.getElementById('ag-tipo').value = a.type;
        document.getElementById('ag-status').value = a.status;
        document.getElementById('ag-obs').value = a.notes;
        document.getElementById('agenda-modal-title').textContent = 'Editar Consulta';
        modalAgenda.classList.add('open');
    }

    function renderUpcomingAppointments() {
        const list = document.getElementById('agenda-upcoming-list');
        if (!list) return;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        const upcoming = appointments.filter(a => a.date >= todayStr && a.date <= nextWeekStr);
        upcoming.sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
        
        if (upcoming.length === 0) {
            list.innerHTML = '<div class="empty-small">Nenhuma consulta nos próximos 7 dias.</div>';
            return;
        }
        
        list.innerHTML = upcoming.map(a => {
            let cls = '';
            if (a.status === 'Remarcada') cls = 'remarcada';
            if (a.status === 'Faltou') cls = 'faltou';
            
            const dateFmt = new Date(a.date + 'T00:00:00').toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit', month: '2-digit'});
            
            return `
                <div class="agenda-item ${cls}" onclick="editAppointment(${a.id})" style="cursor:pointer">
                    <div class="agenda-item-time">${dateFmt} às ${a.time}</div>
                    <div class="agenda-item-patient">${a.patientName}</div>
                    <div class="agenda-item-type">${a.type} • ${a.status}</div>
                </div>
            `;
        }).join('');
    }

    function refreshAgendaView() {
        renderCalendar();
    }

    // ========== FINANCEIRO ==========
    let transactions = Store.get('transactions');
    let finDate = new Date();

    const modalTransaction = document.getElementById('modal-transacao');
    let currentTransactionType = 'receita';

    const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    function formatBRL(val) {
        return 'R$ ' + val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Type toggle
    document.querySelectorAll('.fin-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fin-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTransactionType = btn.dataset.type;
        });
    });

    // Open modal
    document.getElementById('btn-open-transaction').addEventListener('click', () => {
        clearTransactionForm();
        document.getElementById('modal-transaction-title').textContent = 'Nova Transação';
        modalTransaction.classList.add('open');
    });

    document.getElementById('modal-transaction-close').addEventListener('click', () => modalTransaction.classList.remove('open'));
    document.getElementById('btn-cancel-transaction').addEventListener('click', () => modalTransaction.classList.remove('open'));
    modalTransaction.addEventListener('click', (e) => { if (e.target === modalTransaction) modalTransaction.classList.remove('open'); });

    // Save
    document.getElementById('btn-save-transaction').addEventListener('click', () => {
        const desc = document.getElementById('tr-descricao').value.trim();
        const valor = parseFloat(document.getElementById('tr-valor').value);
        const data = document.getElementById('tr-data').value;

        if (!desc || !valor || !data) {
            showToast('Preencha descrição, valor e data.', 'error');
            return;
        }

        const editId = document.getElementById('transaction-edit-id').value;
        const pacSel = document.getElementById('tr-paciente');
        const tr = {
            id: editId ? parseInt(editId) : Date.now(),
            type: currentTransactionType,
            description: desc,
            value: valor,
            date: data,
            category: document.getElementById('tr-categoria').value,
            patientId: pacSel.value || '',
            patientName: pacSel.value ? pacSel.options[pacSel.selectedIndex].text : '',
            status: document.getElementById('tr-status').value,
            obs: document.getElementById('tr-obs').value.trim(),
            createdAt: editId ? (transactions.find(t => t.id === parseInt(editId))?.createdAt || new Date().toISOString()) : new Date().toISOString()
        };

        if (editId) {
            const idx = transactions.findIndex(t => t.id === parseInt(editId));
            if (idx >= 0) transactions[idx] = tr;
        } else {
            transactions.push(tr);
        }

        Store.set('transactions', transactions);
        modalTransaction.classList.remove('open');
        refreshFinanceiroView();
        showToast(editId ? 'Transação atualizada!' : 'Transação registrada!', 'success');
    });

    function clearTransactionForm() {
        document.getElementById('transaction-edit-id').value = '';
        document.getElementById('tr-descricao').value = '';
        document.getElementById('tr-valor').value = '';
        document.getElementById('tr-data').value = new Date().toISOString().split('T')[0];
        document.getElementById('tr-categoria').value = 'Consulta';
        document.getElementById('tr-status').value = 'pago';
        document.getElementById('tr-obs').value = '';
        currentTransactionType = 'receita';
        document.querySelectorAll('.fin-type-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('fin-type-receita').classList.add('active');
    }

    window.editTransaction = function(id) {
        const tr = transactions.find(t => t.id === id);
        if (!tr) return;
        document.getElementById('transaction-edit-id').value = tr.id;
        document.getElementById('tr-descricao').value = tr.description;
        document.getElementById('tr-valor').value = tr.value;
        document.getElementById('tr-data').value = tr.date;
        document.getElementById('tr-categoria').value = tr.category;
        document.getElementById('tr-status').value = tr.status;
        document.getElementById('tr-obs').value = tr.obs || '';
        const pacSel = document.getElementById('tr-paciente');
        pacSel.value = tr.patientId || '';
        currentTransactionType = tr.type;
        document.querySelectorAll('.fin-type-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`fin-type-${tr.type}`).classList.add('active');
        document.getElementById('modal-transaction-title').textContent = 'Editar Transação';
        modalTransaction.classList.add('open');
    };

    window.deleteTransaction = function(id) {
        if (!confirm('Excluir esta transação?')) return;
        transactions = transactions.filter(t => t.id !== id);
        Store.set('transactions', transactions);
        refreshFinanceiroView();
        showToast('Transação removida.', 'info');
    };

    // Month nav
    document.getElementById('fin-prev-month').addEventListener('click', () => {
        finDate.setMonth(finDate.getMonth() - 1);
        refreshFinanceiroView();
    });

    document.getElementById('fin-next-month').addEventListener('click', () => {
        finDate.setMonth(finDate.getMonth() + 1);
        refreshFinanceiroView();
    });

    // Filters
    ['fin-filter-type', 'fin-filter-category', 'fin-filter-status'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => renderTransactionList());
    });

    function getMonthTransactions() {
        const y = finDate.getFullYear();
        const m = finDate.getMonth();
        return transactions.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === y && d.getMonth() === m;
        });
    }

    function refreshFinanceiroView() {
        const monthly = getMonthTransactions();
        const receitas = monthly.filter(t => t.type === 'receita').reduce((s, t) => s + t.value, 0);
        const despesas = monthly.filter(t => t.type === 'despesa').reduce((s, t) => s + t.value, 0);
        const lucro = receitas - despesas;

        document.getElementById('fin-month-label').textContent = `${MONTHS_PT[finDate.getMonth()]} ${finDate.getFullYear()}`;
        document.getElementById('fin-receitas').textContent = formatBRL(receitas);
        document.getElementById('fin-despesas').textContent = formatBRL(despesas);
        document.getElementById('fin-lucro').textContent = formatBRL(lucro);
        document.getElementById('fin-count').textContent = monthly.length;

        // Lucro color
        const lucroEl = document.getElementById('fin-lucro');
        lucroEl.style.color = lucro >= 0 ? 'var(--accent)' : 'var(--red)';

        renderFinChart(monthly);
        renderCategories(monthly);
        populateCategoryFilter(monthly);
        renderTransactionList();
    }

    function renderFinChart(monthly) {
        const canvas = document.getElementById('fin-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const y = finDate.getFullYear();
        const m = finDate.getMonth();
        const daysInMonth = new Date(y, m + 1, 0).getDate();

        // Aggregate by day
        const incomeByDay = new Array(daysInMonth).fill(0);
        const expenseByDay = new Array(daysInMonth).fill(0);
        monthly.forEach(t => {
            const day = new Date(t.date).getDate() - 1;
            if (t.type === 'receita') incomeByDay[day] += t.value;
            else expenseByDay[day] += t.value;
        });

        const maxVal = Math.max(...incomeByDay, ...expenseByDay, 100);
        const padL = 60, padR = 20, padT = 20, padB = 40;
        const chartW = W - padL - padR;
        const chartH = H - padT - padB;
        const barW = Math.max(2, (chartW / daysInMonth - 4) / 2);

        const isDark = currentTheme === 'dark';
        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        const textColor = isDark ? '#94a3b8' : '#64748b';

        // Grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const yPos = padT + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padL, yPos);
            ctx.lineTo(W - padR, yPos);
            ctx.stroke();

            ctx.fillStyle = textColor;
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            const label = Math.round(maxVal - (maxVal / 4) * i);
            ctx.fillText(label, padL - 8, yPos + 4);
        }

        // Bars
        for (let d = 0; d < daysInMonth; d++) {
            const x = padL + (d / daysInMonth) * chartW;
            const incH = (incomeByDay[d] / maxVal) * chartH;
            const expH = (expenseByDay[d] / maxVal) * chartH;

            // Income bar
            ctx.fillStyle = '#10b981';
            ctx.fillRect(x, padT + chartH - incH, barW, incH);

            // Expense bar
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x + barW + 1, padT + chartH - expH, barW, expH);

            // Day label (show every 5 days + 1st + last)
            if (d === 0 || d === daysInMonth - 1 || (d + 1) % 5 === 0) {
                ctx.fillStyle = textColor;
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(d + 1, x + barW, H - padB + 16);
            }
        }

        // Legend
        ctx.font = '12px Inter';
        ctx.fillStyle = '#10b981';
        ctx.fillRect(padL, H - 14, 10, 10);
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.fillText('Receitas', padL + 14, H - 5);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padL + 90, H - 14, 10, 10);
        ctx.fillStyle = textColor;
        ctx.fillText('Despesas', padL + 104, H - 5);
    }

    function renderCategories(monthly) {
        const catEl = document.getElementById('fin-categories');
        if (monthly.length === 0) {
            catEl.innerHTML = '<div class="empty-small">Nenhuma transação neste mês.</div>';
            return;
        }

        const catMap = {};
        monthly.forEach(t => {
            const key = t.category || 'Outros';
            if (!catMap[key]) catMap[key] = { income: 0, expense: 0 };
            if (t.type === 'receita') catMap[key].income += t.value;
            else catMap[key].expense += t.value;
        });

        const totalMax = Math.max(...Object.values(catMap).map(c => Math.max(c.income, c.expense)), 1);

        catEl.innerHTML = Object.entries(catMap).sort((a, b) => (b[1].income + b[1].expense) - (a[1].income + a[1].expense)).map(([name, data]) => {
            const isIncome = data.income > data.expense;
            const value = isIncome ? data.income : data.expense;
            const pct = (value / totalMax) * 100;
            const cls = isIncome ? 'income' : 'expense';
            return `
                <div class="fin-cat-item">
                    <div class="fin-cat-bar-wrap">
                        <div class="fin-cat-header">
                            <span class="fin-cat-name">${name}</span>
                            <span class="fin-cat-value ${cls}">${isIncome ? '+' : '-'}${formatBRL(value)}</span>
                        </div>
                        <div class="fin-cat-bar">
                            <div class="fin-cat-fill ${cls}" style="width:${pct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function populateCategoryFilter(monthly) {
        const sel = document.getElementById('fin-filter-category');
        const current = sel.value;
        const cats = [...new Set(monthly.map(t => t.category || 'Outros'))].sort();
        sel.innerHTML = '<option value="all">Todas categorias</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
        sel.value = current;
    }

    function renderTransactionList() {
        const monthly = getMonthTransactions();
        const filterType = document.getElementById('fin-filter-type').value;
        const filterCat = document.getElementById('fin-filter-category').value;
        const filterStatus = document.getElementById('fin-filter-status').value;

        let filtered = monthly;
        if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
        if (filterCat !== 'all') filtered = filtered.filter(t => (t.category || 'Outros') === filterCat);
        if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);

        const container = document.getElementById('fin-transactions');
        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state">
                <div class="empty-icon">💸</div>
                <h3>Nenhuma transação encontrada</h3>
                <p>${monthly.length === 0 ? 'Clique em "Nova Transação" para começar.' : 'Tente alterar os filtros.'}</p>
            </div>`;
            return;
        }

        container.innerHTML = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t, i) => {
            const dateFmt = new Date(t.date).toLocaleDateString('pt-BR');
            const icon = t.type === 'receita' ? '📈' : '📉';
            const meta = [dateFmt, t.category, t.patientName].filter(Boolean).join(' • ');
            return `
                <div class="fin-tr-item" style="animation-delay:${i * 0.03}s">
                    <div class="fin-tr-type ${t.type}">${icon}</div>
                    <div class="fin-tr-info">
                        <div class="fin-tr-desc">${t.description}</div>
                        <div class="fin-tr-meta">${meta}</div>
                    </div>
                    <span class="fin-tr-value ${t.type}">${t.type === 'receita' ? '+' : '-'}${formatBRL(t.value)}</span>
                    <span class="fin-tr-status ${t.status}">${t.status}</span>
                    <div class="fin-tr-actions">
                        <button class="fin-tr-btn" onclick="editTransaction(${t.id})">✏️</button>
                        <button class="fin-tr-btn delete" onclick="deleteTransaction(${t.id})">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Export
    document.getElementById('btn-export-finance').addEventListener('click', () => {
        const monthly = getMonthTransactions();
        if (monthly.length === 0) { showToast('Nenhuma transação para exportar.', 'error'); return; }

        const receitas = monthly.filter(t => t.type === 'receita').reduce((s, t) => s + t.value, 0);
        const despesas = monthly.filter(t => t.type === 'despesa').reduce((s, t) => s + t.value, 0);

        let txt = `=== RELATÓRIO FINANCEIRO ===\n`;
        txt += `${MONTHS_PT[finDate.getMonth()]} ${finDate.getFullYear()}\n`;
        txt += `${'='.repeat(40)}\n\n`;
        txt += `RESUMO:\n`;
        txt += `  Receitas:  ${formatBRL(receitas)}\n`;
        txt += `  Despesas:  ${formatBRL(despesas)}\n`;
        txt += `  Lucro:     ${formatBRL(receitas - despesas)}\n\n`;
        txt += `${'─'.repeat(40)}\n`;
        txt += `TRANSAÇÕES:\n\n`;

        monthly.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(t => {
            txt += `${new Date(t.date).toLocaleDateString('pt-BR')} | ${t.type === 'receita' ? '+' : '-'}${formatBRL(t.value)} | ${t.description} | ${t.category} | ${t.status}\n`;
        });

        const blob = new Blob([txt], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `financeiro_${finDate.getFullYear()}_${String(finDate.getMonth() + 1).padStart(2, '0')}.txt`;
        a.click();
        showToast('Relatório exportado!', 'success');
    });


    // ========== INIT ==========
    applyTheme(currentTheme);
    refreshDashboard();
    refreshPatientSelects();
    renderRecCards();

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
            obs: document.getElementById('p-obs').value.trim(),
            // Anamnese fields
            refeicoes: document.getElementById('p-refeicoes').value,
            alergias: document.getElementById('p-alergias').value.trim(),
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
        if (typeof checkAchievements === 'function') checkAchievements(data.id, 'Primeira Consulta');
    });

    // We also need to override editPatient global function to load anamnese fields
    const origEditPatient = window.editPatient;
    window.editPatient = function(id) {
        origEditPatient(id);
        const p = patients.find(x => x.id === id);
        if (!p) return;
        
        document.getElementById('p-refeicoes').value = p.refeicoes || '';
        document.getElementById('p-alergias').value = p.alergias || '';
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
        ['p-refeicoes','p-alergias','p-restricoes','p-favoritos','p-nao-gosta','p-ativ','p-freq-exer','p-tipo-exer','p-sono-hr','p-sono-qual','p-fumante','p-alcool','p-doencas','p-medicamentos','p-hist-fam','p-intestino','p-agua-est']
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
                return val ? `<div class="medida-stat"><span class="medida-stat-lbl">${lbl}</span><span class="medida-stat-val">${val} ${trend}</span></div>` : '';
            };
            
            return `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${formatDate(m.date)}</span>
                    <div class="history-actions"><button onclick="deleteMedida(${m.id})">Remover</button></div>
                </div>
                <div class="medida-grid">
                    ${renderStat('Peso', m.peso, 'peso')}
                    ${renderStat('Cintura', m.cintura, 'cintura')}
                    ${renderStat('Quadril', m.quadril, 'quadril')}
                    ${renderStat('Braço D', m.bracoD, 'bracoD')}
                    ${renderStat('Braço E', m.bracoE, 'bracoE')}
                    ${renderStat('Coxa D', m.coxaD, 'coxaD')}
                    ${renderStat('Coxa E', m.coxaE, 'coxaE')}
                    ${renderStat('Panturrilha', m.panturrilha, 'panturrilha')}
                    ${renderStat('Peitoral', m.peitoral, 'peitoral')}
                </div>
            </div>
            `;
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
        
        if (typeof checkAchievements === 'function') checkAchievements(p.id, 'Medidas Registradas');
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
        'HDL': { unit: 'mg/dL', min: 40, max: 100 },
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
            document.getElementById('ex-ref').value = `${examRefs[t].min} - ${examRefs[t].max} ${examRefs[t].unit}`;
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
        
        const grouped = {};
        filtered.forEach(e => {
            if (!grouped[e.date]) grouped[e.date] = [];
            grouped[e.date].push(e);
        });
        
        historyContainer.innerHTML = Object.keys(grouped).sort((a,b) => new Date(b)-new Date(a)).map(date => {
            const exms = grouped[date];
            return `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${formatDate(date)}</span>
                </div>
                <div class="exame-table-wrap">
                <table class="exame-table">
                    <thead><tr><th>Exame</th><th>Resultado</th><th>Referência</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                        ${exms.map(e => `
                        <tr>
                            <td>${e.examType}</td>
                            <td><strong>${e.value} ${e.unit}</strong></td>
                            <td><span style="font-size:0.75rem;color:var(--text-muted)">${e.refMin}-${e.refMax}</span></td>
                            <td><span class="status-badge status-${e.status}">${e.status}</span></td>
                            <td><button onclick="deleteExame(${e.id})" style="background:none;border:none;color:var(--red);cursor:pointer;">✕</button></td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                </div>
            </div>
            `;
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
        let html = `
            <div class="print-header">
                <div class="print-title">Plano Alimentar Individualizado</div>
                <div class="print-subtitle">Nutricionista - Lo Diet Pro</div>
            </div>
            <div class="print-patient-info">
                <div><strong>Paciente:</strong> ${pt ? pt.nome : 'Geral'}</div>
                <div><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
        `;
        
        const grouped = {};
        meals.forEach(m => {
            if (ptId && m.pacienteId !== parseInt(ptId)) return;
            const key = m.dia || 'all';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(m);
        });
        
        Object.keys(grouped).forEach(day => {
            html += `<div class="print-day">`;
            html += `<div class="print-day-title">${dayLabels[day] || day}</div>`;
            grouped[day].sort((a, b) => (a.horario || '').localeCompare(b.horario || '')).forEach(m => {
                html += `
                <div class="print-meal">
                    <div class="print-meal-header">
                        <span>${m.tipo}</span>
                        ${m.horario ? `<span class="print-meal-time">(${m.horario})</span>` : ''}
                    </div>
                    <div class="print-meal-foods">${m.alimentos}</div>
                    `;
                if(m.calorias || m.proteinas) {
                    html += `<div class="print-meal-macros">${m.calorias} kcal | ${m.proteinas}g P | ${m.carboidratos}g C | ${m.gorduras}g G</div>`;
                }
                if(m.obs) {
                    html += `<div class="print-meal-obs">Obs: ${m.obs}</div>`;
                }
                html += `</div>`;
            });
            html += `</div>`;
        });
        
        html += `<div class="print-footer">Este plano é individual e intransferível.</div>`;
        
        printDiv.innerHTML = html;
        window.print();
        
        if (pt) if (typeof checkAchievements === 'function') checkAchievements(pt.id, 'Plano Criado');
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
            text += `*--- ${(dayLabels[day] || day).toUpperCase()} ---*\n\n`;
            grouped[day].sort((a, b) => (a.horario || '').localeCompare(b.horario || '')).forEach(m => {
                text += `🕒 *${m.tipo}* ${m.horario ? '('+m.horario+')' : ''}\n`;
                text += `${m.alimentos}\n`;
                if(m.obs) text += `📌 _Obs: ${m.obs}_\n`;
                text += '\n';
            });
        });
        
        const url = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(url, '_blank');
        
        if (ptId) if (typeof checkAchievements === 'function') checkAchievements(parseInt(ptId), 'Plano Criado');
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
                showToast(`🏆 Conquista Desbloqueada: ${title} (${pt.nome})`, 'success');
            }
        };

        if (eventType === 'Primeira Consulta') addBadge('🎯 Primeira Consulta');
        if (eventType === 'IMC Calculado') addBadge('📊 IMC Calculado');
        if (eventType === 'Plano Criado') addBadge('🥗 Plano Criado');
        if (eventType === 'Medidas Registradas') addBadge('📏 Medidas Registradas');
        if (eventType === 'Hidratação 7 dias') addBadge('💧 Hidratação 7 dias');
        
        if (earned) {
            Store.set('achievements', achievements);
            renderDashboardAchievements();
        }
    };
    
    // Inject checking into IMC
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
            return `
            <div class="badge-item">
                <div class="badge-icon">${def.icon}</div>
                <div class="badge-info">
                    <div class="badge-title">${a.title}</div>
                    <div class="badge-desc">${def.desc}</div>
                    <div class="badge-meta">${a.patientName} · ${formatDate(a.date)}</div>
                </div>
            </div>
            `;
        }).join('');
    }

    // Override refreshDashboard to include renderDashboardAchievements
    const origNavigateTo2 = window.navigateTo;
    window.navigateTo = function(viewName) {
        origNavigateTo2(viewName);
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
});
