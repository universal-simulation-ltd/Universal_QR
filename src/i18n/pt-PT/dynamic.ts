import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'A carregar…',
  'cancel': 'Cancelar',
  'delete': 'Eliminar',
  'saving': 'A guardar…',
  'need_more': 'Precisa de mais? Diga-nos',
  'signin_button': 'Criar / iniciar sessão com Universal ID →',

  // Dynamic tab — header
  'title': 'Códigos QR dinâmicos',
  'requires_universal_id': 'Requer um Universal ID',
  'intro': 'Um código impresso, um destino que pode alterar em qualquer momento — e uma contagem de leituras em tempo real. A ligação mantém-se fixa ({link}); o sítio para onde encaminha as pessoas pode ser mudado sempre que quiser.',

  // Dynamic tab — signed out
  'signin_title': 'Crie um Universal ID para fazer códigos QR dinâmicos GRATUITAMENTE.',
  'signin_body': 'Um código QR dinâmico contém uma ligação curta que guardamos no seu {id} — é isso que permite mudar o destino depois de impresso e ver quantas leituras teve. O separador {qr} normal continua 100% gratuito e no seu dispositivo.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Marca dos novos códigos',
  'branding_hint_org': 'Por predefinição, usa o ícone e a cor da sua organização. Cada código mantém o aspeto com que foi criado — para alterar um já existente, use Afinar marca no respetivo cartão.',
  'branding_hint_no_org': 'Cada código mantém o aspeto com que foi criado — para alterar um já existente, use Afinar marca no respetivo cartão. Adicione um logótipo e uma cor de marca à sua organização e passam a aparecer aqui automaticamente.',
  'branding_reset': 'Repor',
  'branding_preview_caption': 'Exemplo · unisim.co.uk',
  'branding_preview_label': 'Exemplo de QR dinâmico com a sua marca',

  // Dynamic tab — create a code
  'new_code_title': 'Novo código dinâmico',
  'purchased_tokens_one': '{count} crédito comprado',
  'purchased_tokens_other': '{count} créditos comprados',
  'signed_in_as': 'Sessão iniciada como {email}',
  'destination_label': 'URL de destino',
  'name_label': 'Etiqueta {optional}',
  'optional': '(opcional)',
  'name_placeholder': 'Folheto da campanha de primavera',
  'creating': 'A criar…',
  'create': 'Criar código dinâmico',
  'checking_account': 'A verificar a sua conta…',

  // Dynamic tab — reaching the limit
  'near_limit': 'Já usou {used} dos seus {limit} códigos dinâmicos gratuitos.',
  'at_limit': 'Já usou os seus códigos dinâmicos gratuitos.',
  'at_limit_make_room': 'Já usou os seus códigos dinâmicos gratuitos. Elimine um para libertar espaço.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Essa marca é demasiado grande para guardar — experimente um logótipo central mais pequeno.',
  'error_no_org': 'Os códigos online ficam guardados com a sua empresa, e o seu Universal ID ainda não tem uma. Criá-la é gratuito.',
  'setup_company_button': 'Criar uma empresa →',
  'error_could_not_create': 'Não foi possível criar este código dinâmico.',
  'error_could_not_delete': 'Não foi possível eliminar este código.',
  'confirm_delete': 'Eliminar «{name}»? Quem o ler verá uma página a indicar que não está ativo.',

  // Dynamic tab — the list of codes
  'your_codes': 'Os seus códigos dinâmicos',
  'empty': 'Ainda não há códigos dinâmicos. Crie o primeiro à esquerda — pode mudar o destino e ver as leituras a chegar.',

  // A dynamic code's card
  'tap_to_enlarge': 'Toque para ampliar',
  'enlarge_label': 'Ampliar o código QR de {target}',
  'qr_label': 'Código QR dinâmico de {target}',
  'edit_branding': '✏️ Afinar marca',
  'close_branding': 'Fechar marca',
  'copy': 'Copiar',
  'copy_link_label': 'Copiar ligação dinâmica',
  'delete_title': 'Eliminar este código',
  'redirects_to': 'Encaminha para',
  'change_destination': 'Alterar destino',
  'save_destination': 'Guardar destino',
  'destination_hint': 'O código impresso mantém-se igual — só muda o sítio para onde encaminha as pessoas.',
  'error_could_not_update_destination': 'Não foi possível atualizar o destino.',
  'total_scans': 'Total de leituras',
  'last_scan': 'Última leitura',
  'no_scans_yet': 'Ainda sem leituras',
  'scans_chart_label': 'Leituras nos últimos 30 dias',
  'scans_one': '{count} leitura',
  'scans_other': '{count} leituras',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'A marca própria deste código. Alterá-la volta a desenhar este código e mais nenhum.',
  'brand_legacy_hint': 'Este código foi criado antes de os códigos terem marca própria, por isso continua a seguir o painel acima. Guardar aqui fixa o aspeto neste código.',
  'match_branding': 'Igualar à marca dos novos códigos',
  'brand_preview_caption': 'Pré-visualização · {target}',
  'brand_preview_label': 'Pré-visualização de {name} com esta marca',
  'save_branding': 'Guardar marca',
  'brand_save_hint': 'A ligação e a contagem de leituras não mudam — mas o que já estiver impresso mantém o aspeto antigo, por isso transfira-o novamente.',
  'error_could_not_save_branding': 'Não foi possível guardar a marca deste código.',
  'error_design_too_large': 'Esse design é demasiado grande para guardar — experimente um logótipo central mais pequeno.',

  // "Back up this QR code" dialog
  'backup_title': 'Guardar este código QR',
  'backup_close': 'Fechar',
  'backup_sign_in': 'Crie um {id} para fazer cópias de segurança dos seus códigos QR online GRATUITAMENTE e abri-los em qualquer dispositivo.',
  'backup_backing_up': 'A fazer a cópia de segurança…',
  'backup_backed_up': '✓ Cópia de segurança feita',
  'backup_back_up_online': 'Fazer cópia de segurança online',
  'backup_needs_data': 'Introduza um URL ou algum texto para fazer a cópia de segurança do código QR.',
  'backup_near_limit': 'Já usou {used} das suas {limit} cópias de segurança online gratuitas.',
  'backup_used_up': 'Já usou as suas cópias de segurança online gratuitas. Elimine uma abaixo para libertar espaço.',
  'backup_your_backups': 'As suas cópias de segurança',
  'backup_none_yet': 'Ainda nenhuma.',
  'backup_open': 'Abrir',
  'backup_delete_title': 'Eliminar esta cópia de segurança',
  'backup_missing': '{file} aparece nesta lista, mas não há nenhum ficheiro associado — esta gravação nunca foi concluída, por isso nada chegou a ser armazenado. O seu espaço de gravação continua reservado para ela.',
  'backup_remove_entry': 'Remover esta entrada e libertar o espaço',
  'backup_could_not_store': 'Não foi possível armazenar este código QR.',
  'backup_could_not_delete': 'Não foi possível eliminar este código QR.',
  'backup_could_not_save_now': 'De momento, não foi possível guardar.',
  'backup_could_not_delete_now': 'De momento, não foi possível eliminar esta cópia de segurança.',
}

export default dynamic
