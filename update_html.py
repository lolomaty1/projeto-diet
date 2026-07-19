import re

def insert_after(text, search_str, insert_str):
    pos = text.find(search_str)
    if pos == -1:
        print(f"Could not find: {search_str}")
        return text
    pos += len(search_str)
    return text[:pos] + "\n" + insert_str + text[pos:]

def insert_before(text, search_str, insert_str):
    pos = text.find(search_str)
    if pos == -1:
        print(f"Could not find: {search_str}")
        return text
    return text[:pos] + insert_str + "\n" + text[pos:]

def replace(text, search_str, replace_str):
    if text.find(search_str) == -1:
        print(f"Could not find to replace: {search_str}")
    return text.replace(search_str, replace_str)

html = open("index.html", "r", encoding="utf-8").read()

# 1. Nav items
nav_items = """            <button class="nav-item" data-view="medidas" id="nav-medidas">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span>Medidas</span>
            </button>
            <button class="nav-item" data-view="exames" id="nav-exames">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12h3l3 -9l5 18l3 -9h5"/></svg>
                <span>Exames</span>
            </button>"""
html = insert_after(html, """            <button class="nav-item" data-view="evolucao" id="nav-evolucao">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                <span>Evolução</span>
            </button>""", nav_items)

# 2. Patient Modal Anamnese Tabs
patient_modal_body_orig = """                <div class="modal-body">
                    <input type="hidden" id="patient-edit-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="p-nome">Nome completo *</label>"""
patient_modal_body_new = """                <div class="modal-body">
                    <input type="hidden" id="patient-edit-id">
                    <div class="modal-tabs" id="patient-tabs">
                        <button class="modal-tab active" data-tab="tab-p-dados">Dados Pessoais</button>
                        <button class="modal-tab" data-tab="tab-p-anamnese">Anamnese</button>
                    </div>
                    
                    <div id="tab-p-dados" class="tab-content active">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="p-nome">Nome completo *</label>"""

html = replace(html, patient_modal_body_orig, patient_modal_body_new)

patient_modal_alergias_orig = """                    <div class="form-group">
                        <label class="form-label" for="p-alergias">Alergias / Restrições alimentares</label>
                        <textarea id="p-alergias" class="form-input form-textarea" rows="2" placeholder="Ex: Intolerância à lactose, alergia a frutos do mar..."></textarea>
                    </div>"""
html = replace(html, patient_modal_alergias_orig, "")

patient_modal_body_end_orig = """                    <div class="form-group">
                        <label class="form-label" for="p-obs">Observações clínicas</label>
                        <textarea id="p-obs" class="form-input form-textarea" rows="2" placeholder="Ex: Diabético tipo 2, hipertensão controlada..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">"""
patient_modal_body_end_new = """                    <div class="form-group">
                        <label class="form-label" for="p-obs">Observações clínicas</label>
                        <textarea id="p-obs" class="form-input form-textarea" rows="2" placeholder="Ex: Diabético tipo 2, hipertensão controlada..."></textarea>
                    </div>
                    </div><!-- tab-p-dados -->
                    
                    <div id="tab-p-anamnese" class="tab-content" style="display:none;">
                        <h4 style="margin-bottom:8px;">Hábitos Alimentares</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-refeicoes">Refeições por dia</label>
                                <select id="p-refeicoes" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                                    <option value="4">4</option><option value="5">5</option><option value="6">6 ou mais</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="p-alergias">Alergias / Intolerâncias</label>
                            <textarea id="p-alergias" class="form-input form-textarea" rows="2" placeholder="Ex: Intolerância à lactose..."></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="p-restricoes">Restrições alimentares</label>
                            <textarea id="p-restricoes" class="form-input form-textarea" rows="2" placeholder="Vegetariano, vegano, etc..."></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-favoritos">Alimentos favoritos</label>
                                <textarea id="p-favoritos" class="form-input form-textarea" rows="2"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="p-nao-gosta">Alimentos que não gosta</label>
                                <textarea id="p-nao-gosta" class="form-input form-textarea" rows="2"></textarea>
                            </div>
                        </div>
                        
                        <h4 style="margin:16px 0 8px;">Estilo de Vida</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-ativ">Nível atividade física</label>
                                <select id="p-ativ" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="Sedentário">Sedentário</option>
                                    <option value="Leve">Leve</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Intenso">Intenso</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="p-freq-exer">Frequência de exercício</label>
                                <input type="text" id="p-freq-exer" class="form-input" placeholder="Ex: 3x na semana">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="p-tipo-exer">Tipo de exercício</label>
                            <input type="text" id="p-tipo-exer" class="form-input" placeholder="Musculação, corrida...">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-sono-hr">Horas de sono</label>
                                <input type="number" id="p-sono-hr" class="form-input" placeholder="8">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="p-sono-qual">Qualidade do sono</label>
                                <select id="p-sono-qual" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="Boa">Boa</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Ruim">Ruim</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-fumante">Fumante</label>
                                <select id="p-fumante" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                    <option value="Ex-fumante">Ex-fumante</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="p-alcool">Consumo de álcool</label>
                                <select id="p-alcool" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="Nunca">Nunca</option>
                                    <option value="Social">Social</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Frequente">Frequente</option>
                                </select>
                            </div>
                        </div>
                        
                        <h4 style="margin:16px 0 8px;">Saúde</h4>
                        <div class="form-group">
                            <label class="form-label" for="p-doencas">Doenças pré-existentes</label>
                            <textarea id="p-doencas" class="form-input form-textarea" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="p-medicamentos">Medicamentos em uso</label>
                            <textarea id="p-medicamentos" class="form-input form-textarea" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="p-hist-fam">Histórico familiar</label>
                            <textarea id="p-hist-fam" class="form-input form-textarea" rows="2" placeholder="Ex: Diabetes, hipertensão..."></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="p-intestino">Funcionamento intestinal</label>
                                <select id="p-intestino" class="form-input form-select">
                                    <option value="">Selecione</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Irregular">Irregular</option>
                                    <option value="Constipação">Constipação</option>
                                    <option value="Diarreia">Diarreia</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="p-agua-est">Consumo água diário est.</label>
                                <input type="text" id="p-agua-est" class="form-input" placeholder="Ex: 2 Litros">
                            </div>
                        </div>
                    </div><!-- tab-p-anamnese -->
                </div>
                <div class="modal-footer">"""
html = replace(html, patient_modal_body_end_orig, patient_modal_body_end_new)

# Patient card details - inject anamnese button or section. Will handle it via JS instead when rendering patients.

# 3. Diet Buttons
diet_buttons_orig = """                    <button class="btn btn-ghost" id="btn-export-diet">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>Exportar</span>
                    </button>"""
diet_buttons_new = """                    <button class="btn btn-ghost" id="btn-export-diet">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>Exportar TXT</span>
                    </button>
                    <button class="btn btn-ghost" id="btn-export-pdf">
                        <span>📄 Gerar PDF</span>
                    </button>
                    <button class="btn btn-ghost" id="btn-share-whatsapp" style="color: #25D366;">
                        <span>📱 WhatsApp</span>
                    </button>"""
html = replace(html, diet_buttons_orig, diet_buttons_new)

# 4. Dashboard Gamification
dash_tips_orig = """                <!-- Tips -->
                <div class="card card-tips">"""
dash_gamification_new = """                <!-- Gamificacao -->
                <div class="card" style="grid-column: 1 / -1;">
                    <div class="card-header">
                        <h3 class="card-title">🏆 Conquistas Recentes</h3>
                    </div>
                    <div class="achievements-list" id="dash-achievements">
                        <div class="empty-small">Nenhuma conquista ainda.</div>
                    </div>
                </div>

                <!-- Tips -->
                <div class="card card-tips">"""
html = replace(html, dash_tips_orig, dash_gamification_new)

# 5. Medidas and Exames views
views_to_insert = """
        <!-- ===== MEDIDAS VIEW ===== -->
        <div class="view" id="view-medidas">
            <div class="view-header">
                <div>
                    <h1 class="view-title">Medidas Corporais</h1>
                    <p class="view-subtitle">Registre e acompanhe as medidas de seus pacientes.</p>
                </div>
            </div>
            <div class="medidas-layout">
                <div class="card">
                    <div class="form-group">
                        <label class="form-label" for="med-paciente">Paciente</label>
                        <select id="med-paciente" class="form-input form-select">
                            <option value="">— Selecione —</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="med-data">Data</label>
                            <input type="date" id="med-data" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="med-peso">Peso (kg)</label>
                            <input type="number" id="med-peso" class="form-input" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="med-cintura">Cintura (cm)</label>
                            <input type="number" id="med-cintura" class="form-input" step="0.1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="med-quadril">Quadril (cm)</label>
                            <input type="number" id="med-quadril" class="form-input" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="med-braco-d">Braço D (cm)</label>
                            <input type="number" id="med-braco-d" class="form-input" step="0.1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="med-braco-e">Braço E (cm)</label>
                            <input type="number" id="med-braco-e" class="form-input" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="med-coxa-d">Coxa D (cm)</label>
                            <input type="number" id="med-coxa-d" class="form-input" step="0.1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="med-coxa-e">Coxa E (cm)</label>
                            <input type="number" id="med-coxa-e" class="form-input" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="med-panturrilha">Panturrilha (cm)</label>
                            <input type="number" id="med-panturrilha" class="form-input" step="0.1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="med-peitoral">Peitoral (cm)</label>
                            <input type="number" id="med-peitoral" class="form-input" step="0.1">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" id="btn-add-medida">Registrar Medidas</button>
                    
                    <div class="rcq-result" id="rcq-result" style="display:none; margin-top:16px; padding:12px; border-radius:8px; background:var(--bg-secondary);">
                        <div style="font-weight:600; margin-bottom:4px;">Relação Cintura/Quadril (RCQ)</div>
                        <div id="rcq-val" style="font-size:1.5rem; font-weight:700;"></div>
                        <div id="rcq-class" style="font-size:0.9rem;"></div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="card-title" style="margin-bottom:16px;">📋 Histórico</h3>
                    <div class="medidas-history" id="medidas-history">
                        <div class="empty-small">Selecione um paciente para ver o histórico.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== EXAMES VIEW ===== -->
        <div class="view" id="view-exames">
            <div class="view-header">
                <div>
                    <h1 class="view-title">Registro de Exames Laboratoriais</h1>
                    <p class="view-subtitle">Acompanhe os resultados dos exames dos pacientes.</p>
                </div>
            </div>
            <div class="exames-layout">
                <div class="card">
                    <div class="form-group">
                        <label class="form-label" for="ex-paciente">Paciente</label>
                        <select id="ex-paciente" class="form-input form-select">
                            <option value="">— Selecione —</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="ex-data">Data</label>
                            <input type="date" id="ex-data" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="ex-tipo">Exame</label>
                            <select id="ex-tipo" class="form-input form-select">
                                <option value="">Selecione...</option>
                                <option value="Glicemia em Jejum">Glicemia em Jejum</option>
                                <option value="Hemoglobina Glicada">Hemoglobina Glicada</option>
                                <option value="Colesterol Total">Colesterol Total</option>
                                <option value="HDL">HDL</option>
                                <option value="LDL">LDL</option>
                                <option value="Triglicerídeos">Triglicerídeos</option>
                                <option value="TSH">TSH</option>
                                <option value="T4 Livre">T4 Livre</option>
                                <option value="Vitamina D">Vitamina D</option>
                                <option value="Vitamina B12">Vitamina B12</option>
                                <option value="Ferro Sérico">Ferro Sérico</option>
                                <option value="Ferritina">Ferritina</option>
                                <option value="Hemoglobina">Hemoglobina</option>
                                <option value="Ácido Úrico">Ácido Úrico</option>
                                <option value="Creatinina">Creatinina</option>
                                <option value="TGO/AST">TGO/AST</option>
                                <option value="TGP/ALT">TGP/ALT</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="ex-valor">Valor</label>
                            <input type="number" id="ex-valor" class="form-input" step="0.01">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="ex-ref">Referência</label>
                            <input type="text" id="ex-ref" class="form-input" disabled>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" id="btn-add-exame">Registrar Exame</button>
                </div>
                <div class="card">
                    <h3 class="card-title" style="margin-bottom:16px;">📋 Resultados</h3>
                    <div class="exames-history" id="exames-history">
                        <div class="empty-small">Selecione um paciente para ver os exames.</div>
                    </div>
                </div>
            </div>
        </div>
"""
html = insert_before(html, "        <!-- ===== AGENDA VIEW ===== -->", views_to_insert)

print_diet_div = '<div id="print-diet" class="print-only"></div>'
html = insert_before(html, "    <!-- Toast Container -->", print_diet_div)

open("index.html", "w", encoding="utf-8").write(html)
print("index.html updated")
