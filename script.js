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
            localStorage.setItem(`lodiet_${key}`, JSON.stringify(value));
        }
    };

    let patients = Store.get('patients');
    let meals = Store.get('meals');
    let imcHistory = Store.get('imc_history');
    let notes = Store.get('notes');
    let waterLog = Store.get('water_log');
    let waterGoal = Store.get('water_goal', 2000);
    let imcCount = Store.get('imc_count', 0);

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
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
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
        const selects = ['imc-paciente-select', 'diet-paciente-select', 'meal-paciente', 'tpl-apply-patient'];
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
        renderIMCHistory();
    };

    document.getElementById('btn-clear-imc-history').addEventListener('click', () => {
        if (!confirm('Limpar todo o histórico de IMC?')) return;
        imcHistory = [];
        Store.set('imc_history', imcHistory);
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
        ctx.fillStyle = '#0f172a';
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

    // ========== INIT ==========
    refreshDashboard();
    refreshPatientSelects();
    renderRecCards();
});
