"""Optional browser checks. Install Playwright and run against Vite or preview.

IMPULSO_TEST_URL=http://127.0.0.1:5173 python3 tests/browser_smoke.py
"""
import json
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('IMPULSO_TEST_URL', 'http://127.0.0.1:5173').rstrip('/')
OUT = os.environ.get('IMPULSO_SCREENSHOTS')
ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'src/data/contents.json').read_text())
checks = 0

def passed(label):
    global checks
    checks += 1
    print(f'PASS {checks:02}: {label}', flush=True)

with sync_playwright() as p:
    options = {'headless': True, 'args': ['--no-sandbox']}
    executable = shutil.which('chromium') or shutil.which('google-chrome')
    if executable:
        options['executable_path'] = executable
    browser = p.chromium.launch(**options)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    page = context.new_page()
    errors, failed = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', lambda response: failed.append(f'{response.status} {response.url}') if response.status >= 400 else None)
    page.goto(BASE, wait_until='networkidle')
    expect(page.locator('h1')).to_contain_text('pequeno impulso')
    expect(page.locator('.content-card')).to_have_count(6)
    assert page.locator('.content-card--phrase').count()
    assert page.locator('.content-card--video').count()
    assert page.locator('.content-card--story').count()
    expect(page.locator('.category-card')).to_have_count(6)
    passed('home has 6 categories and a genuinely mixed recommendation feed')

    for route in ['', '/explorar', '/favoritos', '/conteudo/um-passo-ja-e-movimento']:
        page.goto(BASE + '/#' + route, wait_until='networkidle')
        expect(page.locator('h1')).to_be_visible()
        for width in [320, 360, 390, 650, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (route, width)
        expect(page.locator('main')).to_be_visible()
    passed('all 4 main routes render without horizontal overflow at 8 widths')

    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.goto(BASE + '/#/explorar', wait_until='networkidle')
    expect(page.locator('.content-card')).to_have_count(18)
    page.get_by_role('group', name='Filtrar por categoria').get_by_role('button', name='Disciplina', exact=True).click()
    expect(page.locator('.content-card')).to_have_count(3)
    page.get_by_role('group', name='Filtrar por formato').get_by_role('button', name='Vídeos', exact=True).click()
    expect(page.locator('.content-card')).to_have_count(1)
    expect(page.locator('.card-body h3')).to_have_text('Uma coisa de cada vez.')
    page.reload(wait_until='networkidle')
    expect(page.locator('.content-card')).to_have_count(1)
    assert 'categoria=disciplina' in page.url and 'formato=video' in page.url
    passed('category and format filters intersect correctly and survive a shared/reloaded URL')

    page.get_by_role('button', name='Limpar filtros', exact=True).click()
    expect(page.locator('.content-card')).to_have_count(18)
    page.get_by_role('searchbox', name='Buscar conteúdos').fill('constancia')
    expect(page.locator('.content-card')).to_have_count(2)
    expect(page.locator('.content-card').filter(has_text='Constância também é aprender a voltar.')).to_have_count(1)
    page.get_by_role('searchbox', name='Buscar conteúdos').fill('termo-que-nao-existe-123')
    expect(page.locator('.empty-state')).to_be_visible()
    page.locator('.empty-state').get_by_role('button', name='Limpar filtros').click()
    expect(page.locator('.content-card')).to_have_count(18)
    passed('search ignores accents, searches tags and has a useful resettable empty state')

    page.locator('.interests-button').click()
    dialog = page.get_by_role('dialog')
    expect(dialog).to_be_visible()
    dialog.get_by_role('button', name='Estudos', exact=True).click()
    dialog.get_by_role('button', name='Salvar minhas escolhas', exact=True).click()
    expect(dialog).not_to_be_visible()
    assert json.loads(page.evaluate("localStorage.getItem('impulso:v1:interests')")) == ['estudos']
    expect(page.locator('.category-label').first).to_have_text('Estudos')
    page.reload(wait_until='networkidle')
    expect(page.locator('.category-label').first).to_have_text('Estudos')
    page.locator('.interests-button').click()
    expect(dialog.get_by_role('button', name='Estudos', exact=True)).to_have_attribute('aria-pressed', 'true')
    page.keyboard.press('Escape')
    expect(dialog).not_to_be_visible()
    expect(page.locator('.interests-button')).to_be_focused()
    passed('interest choices persist, prioritize matching contents and dialog restores keyboard focus')

    page.goto(BASE + '/#/conteudo/um-passo-ja-e-movimento', wait_until='networkidle')
    page.get_by_role('button', name='Guardar este impulso', exact=True).click()
    expect(page.get_by_role('button', name='Salvo nos favoritos', exact=True)).to_have_attribute('aria-pressed', 'true')
    page.reload(wait_until='networkidle')
    expect(page.get_by_role('button', name='Salvo nos favoritos', exact=True)).to_be_visible()
    page.goto(BASE + '/#/favoritos', wait_until='networkidle')
    expect(page.locator('.content-card')).to_have_count(1)
    expect(page.locator('.card-body h3')).to_have_text('Um passo já é movimento.')
    page.locator('.favorite-button').click()
    expect(page.locator('.favorites-empty')).to_be_visible()
    page.reload(wait_until='networkidle')
    expect(page.locator('.favorites-empty')).to_be_visible()
    passed('favorites save, reload, render and remove persistently with a helpful empty state')

    page.goto(BASE + '/#/explorar', wait_until='networkidle')
    page.locator('.favorite-button').first.click()
    another = context.new_page()
    another.goto(BASE + '/#/favoritos', wait_until='networkidle')
    expect(another.locator('.content-card')).to_have_count(1)
    page.locator('.favorite-button').first.click()
    expect(another.locator('.favorites-empty')).to_be_visible()
    another.close()
    passed('favorite changes synchronize between tabs')

    for item in [c for c in catalog if c['type'] == 'story']:
        page.goto(BASE + '/#/conteudo/' + item['id'], wait_until='networkidle')
        expect(page.locator('.article-body > p')).to_have_count(len(item['body']))
        expect(page.locator('.source-box a')).to_have_attribute('href', item['source']['url'])
        expect(page.locator('.source-box a')).to_have_attribute('rel', 'noopener noreferrer')
        expect(page.locator('.source-box')).to_contain_text('Síntese editorial')
    passed('all real stories have full readable text, credits and exact source links')

    for item in [c for c in catalog if c['type'] == 'video']:
        page.goto(BASE + '/#/conteudo/' + item['id'], wait_until='networkidle')
        video = page.locator('video')
        expect(video).to_have_attribute('controls', '')
        assert video.get_attribute('autoplay') is None
        assert video.evaluate('v => v.paused')
        video.evaluate('v => v.play()')
        page.wait_for_function('document.querySelector("video").currentTime > 0.2')
        assert 17.9 <= video.evaluate('v => v.duration') <= 18.1
        video.evaluate('v => { v.pause(); v.currentTime = 7; v.textTracks[0].mode = "showing"; }')
        page.wait_for_function('document.querySelector("video").textTracks[0].cues?.length === 5')
        expect(page.locator('.article-body')).to_contain_text('Transcrição:')
    passed('all 3 original videos decode, play, seek and load 5 captions, without autoplay')

    page.goto(BASE + '/#/conteudo/nao-existe', wait_until='networkidle')
    expect(page.locator('.not-found')).to_be_visible()
    page.get_by_role('link', name='Voltar para explorar', exact=True).click()
    expect(page.locator('.content-card')).to_have_count(18)
    page.goto(BASE + '/#/rota-inexistente', wait_until='networkidle')
    expect(page.locator('.not-found')).to_be_visible()
    passed('unknown content and unknown routes offer a functional recovery path')

    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(BASE, wait_until='networkidle')
    expect(page.locator('.bottom-nav')).to_be_visible()
    expect(page.locator('.desktop-nav')).not_to_be_visible()
    page.locator('.bottom-nav').get_by_role('link', name='Explorar', exact=True).click()
    expect(page.locator('h1')).to_contain_text('te move.')
    page.locator('.bottom-nav').get_by_role('link', name='Favoritos', exact=True).click()
    expect(page.locator('.favorites-empty')).to_be_visible()
    page.locator('.bottom-nav').get_by_role('link', name='Início', exact=True).click()
    expect(page.locator('h1')).to_contain_text('pequeno impulso')
    passed('mobile bottom navigation works across all 3 sections')

    assert page.locator('.hero-mascot').evaluate('e => getComputedStyle(e).animationName') == 'none'
    passed('reduced-motion preference disables the animated mascot')

    corrupt = browser.new_context(reduced_motion='reduce')
    corrupt.add_init_script("localStorage.setItem('impulso:v1:interests','{broken'); localStorage.setItem('impulso:v1:favorites','[\"removed-id\",44]');")
    corrupt_page = corrupt.new_page()
    corrupt_page.goto(BASE + '/#/favoritos', wait_until='networkidle')
    expect(corrupt_page.locator('.favorites-empty')).to_be_visible()
    assert corrupt_page.evaluate("localStorage.getItem('impulso:v1:favorites')") == '[]'
    corrupt.close()
    passed('corrupt localStorage and stale content IDs recover without breaking the app')

    blocked = browser.new_context(reduced_motion='reduce')
    blocked.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked for test')}})")
    blocked_page = blocked.new_page()
    blocked_page.goto(BASE, wait_until='networkidle')
    expect(blocked_page.locator('.storage-notice')).to_be_visible()
    blocked_page.locator('.favorite-button').first.click()
    blocked_page.locator('.desktop-nav').get_by_role('link', name='Favoritos').click()
    expect(blocked_page.locator('.content-card')).to_have_count(1)
    blocked.close()
    passed('blocked storage is explained while favorites still work in the current tab')

    if OUT:
        out = Path(OUT)
        out.mkdir(parents=True, exist_ok=True)
        for name, route in [('home',''),('explore','/explorar'),('favorites','/favoritos'),('content','/conteudo/katherine-johnson-curiosidade')]:
            for label,width,height in [('desktop',1440,1000),('mobile',390,844)]:
                page.set_viewport_size({'width':width,'height':height})
                page.goto(BASE + '/#' + route, wait_until='networkidle')
                page.screenshot(path=str(out / f'{name}-{label}.png'),full_page=True)
    assert not errors, errors
    assert not failed, failed
    passed('no JavaScript exceptions or failing HTTP resources during browser checks')
    browser.close()
    print(f'\n{checks} browser checks passed.',flush=True)
