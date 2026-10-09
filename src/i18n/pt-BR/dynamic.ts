import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Carregando…',
  'cancel': 'Cancelar',
  'delete': 'Excluir',
  'saving': 'Salvando…',
  'need_more': 'Precisa de mais? Fale com a gente',
  'signin_button': 'Criar / entrar com Universal ID →',

  // Dynamic tab — header
  'title': 'QR codes dinâmicos',
  'requires_universal_id': 'Requer um Universal ID',
  'intro': 'Um código impresso, um destino que você pode mudar a qualquer momento — e uma contagem de leituras em tempo real. O link continua fixo ({link}); você escolhe para onde ele leva as pessoas sempre que quiser.',

  // Dynamic tab — signed out
  'signin_title': 'Crie um Universal ID para fazer QR codes dinâmicos GRÁTIS.',
  'signin_body': 'Um QR code dinâmico contém um link curto que guardamos para você no seu {id} — é assim que dá para mudar o destino depois de imprimir e ver quantas leituras ele teve. A aba {qr} continua 100% gratuita e no seu dispositivo.',
  'signin_body_qr_tab': 'Criar',

  // Dynamic tab — branding for new codes
  'branding_title': 'Marca dos novos códigos',
  'branding_hint_org': 'Por padrão, usa o ícone e a cor da sua organização. Cada código mantém o visual com que foi criado — para mudar um que já existe, use Afinar marca no cartão dele.',
  'branding_hint_no_org': 'Cada código mantém o visual com que foi criado — para mudar um que já existe, use Afinar marca no cartão dele. Adicione um logotipo e uma cor de marca à sua organização e eles aparecem aqui automaticamente.',
  'branding_reset': 'Redefinir',
  'branding_preview_caption': 'Exemplo · unisim.co.uk',
  'branding_preview_label': 'Exemplo de QR code dinâmico com a sua marca',

  // Dynamic tab — create a code
  'new_code_title': 'Novo código dinâmico',
  'purchased_tokens_one': '{count} token comprado',
  'purchased_tokens_other': '{count} tokens comprados',
  'signed_in_as': 'Conectado como {email}',
  'destination_label': 'URL de destino',
  'name_label': 'Rótulo {optional}',
  'optional': '(opcional)',
  'name_placeholder': 'Folheto da campanha de primavera',
  'creating': 'Criando…',
  'create': 'Criar código dinâmico',
  'checking_account': 'Verificando sua conta…',

  // Dynamic tab — reaching the limit. Only ever shown once the free allowance
  // has run out; deliberately no numbers and no "tokens".
  'near_limit': 'Você usou {used} dos seus {limit} códigos dinâmicos gratuitos.',
  'at_limit': 'Você usou seus códigos dinâmicos gratuitos.',
  'at_limit_make_room': 'Você usou seus códigos dinâmicos gratuitos. Exclua um para liberar espaço.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Essa marca é grande demais para salvar — tente um logotipo central menor.',
  'error_no_org': 'Os códigos online ficam salvos com a sua empresa, e seu Universal ID ainda não tem uma. Criar é grátis.',
  'setup_company_button': 'Criar uma empresa →',
  'error_could_not_create': 'Não foi possível criar este código dinâmico.',
  'error_could_not_delete': 'Não foi possível excluir este código.',
  'confirm_delete': 'Excluir “{name}”? Quem ler o código vai ver uma página dizendo que ele não está ativo.',

  // Dynamic tab — the list of codes
  'your_codes': 'Seus códigos dinâmicos',
  'empty': 'Nenhum código dinâmico ainda. Crie o primeiro à esquerda — você pode redirecioná-lo quando quiser e acompanhar as leituras chegando.',

  // A dynamic code's card
  'tap_to_enlarge': 'Toque para ampliar',
  'enlarge_label': 'Ampliar o QR code de {target}',
  'qr_label': 'QR code dinâmico de {target}',
  'edit_branding': '✏️ Afinar marca',
  'close_branding': 'Fechar marca',
  'copy': 'Copiar',
  'copy_link_label': 'Copiar link dinâmico',
  'delete_title': 'Excluir este código',
  'redirects_to': 'Redireciona para',
  'change_destination': 'Mudar destino',
  'save_destination': 'Salvar destino',
  'destination_hint': 'O código impresso continua o mesmo — só muda para onde ele leva as pessoas.',
  'error_could_not_update_destination': 'Não foi possível atualizar o destino.',
  'total_scans': 'Total de leituras',
  'last_scan': 'Última leitura',
  'no_scans_yet': 'Nenhuma leitura ainda',
  'scans_chart_label': 'Leituras nos últimos 30 dias',
  'scans_one': '{count} leitura',
  'scans_other': '{count} leituras',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'A marca própria deste código. Alterá-la redesenha este código e nenhum outro.',
  'brand_legacy_hint': 'Este código foi criado antes de os códigos terem marca própria, então ele ainda segue o painel acima. Salvar aqui fixa o visual neste código.',
  'match_branding': 'Usar a marca dos novos códigos',
  'brand_preview_caption': 'Prévia · {target}',
  'brand_preview_label': 'Prévia de {name} com esta marca',
  'save_branding': 'Salvar marca',
  'brand_save_hint': 'O link e a contagem de leituras não mudam — mas o que já foi impresso mantém o visual antigo, então baixe o código de novo.',
  'error_could_not_save_branding': 'Não foi possível salvar a marca deste código.',
  'error_design_too_large': 'Esse design é grande demais para salvar — tente um logotipo central menor.',

  // "Back up this QR code" dialog
  'backup_title': 'Salvar este QR code',
  'backup_close': 'Fechar',
  'backup_sign_in': 'Crie um {id} para fazer backup dos seus QR codes on-line GRÁTIS e abri-los em qualquer dispositivo.',
  'backup_backing_up': 'Fazendo backup…',
  'backup_backed_up': '✓ Backup feito',
  'backup_back_up_online': 'Fazer backup on-line deste QR',
  'backup_needs_data': 'Digite uma URL ou um texto para fazer backup do seu QR code.',
  'backup_near_limit': 'Você usou {used} dos seus {limit} backups on-line gratuitos.',
  'backup_used_up': 'Você usou seus backups on-line gratuitos. Exclua um abaixo para liberar espaço.',
  'backup_your_backups': 'Seus backups',
  'backup_none_yet': 'Nenhum ainda.',
  'backup_open': 'Abrir',
  'backup_delete_title': 'Excluir este backup',
  'backup_missing': '{file} aparece aqui, mas não há nenhum arquivo por trás dele — esse salvamento nunca foi concluído, então nada chegou a ser armazenado. A vaga de salvamento continua reservada para ele.',
  'backup_remove_entry': 'Remover esta entrada e liberar a vaga',
  'backup_could_not_store': 'Não foi possível armazenar este QR code.',
  'backup_could_not_delete': 'Não foi possível excluir este QR code.',
  'backup_could_not_save_now': 'Não foi possível salvar agora.',
  'backup_could_not_delete_now': 'Não foi possível excluir este backup agora.',
}

export default dynamic
