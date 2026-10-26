---
title: ¿Qué es Gestión de Vulnerabilidades, cómo funciona y por qué es importante?
lang: es
date: 2026-07-11
read_time: 17 min de lectura
original: https://vulnerability-management.hashnode.dev/qu-es-gesti-n-de-vulnerabilidades-c-mo-funciona-y-por-qu-es-importante
counterpart: ../en/vulnerability-management.html
cover: https://cdn.hashnode.com/uploads/covers/6a443c3a6ecaa7a89af0d14b/4c387ca0-c160-437f-a207-e1ec4130d2e2.png
---

## ¿Qué es una vulnerabilidad?

Una vulnerabilidad corresponde a debilidades o problemas presentes en un sistema que hacen más probable que se materialice una amenaza. A su vez, una amenaza es algo que puede causar daños a los datos de un sistema u organización.

---

## Tipos de Vulnerabilidades

### Vulnerabilidades de Software
- Debilidades no intencionales introducidas durante el proceso de desarrollo.
- Ejemplos: corrupción de memoria, errores lógicos.
- Específicos del lenguaje o independientes del lenguaje.

### Errores de Configuración
- Configuración incorrecta durante la instalación o mantenimiento como por ejemplo credenciales predeterminadas, privilegios excesivos o puertos innecesarios abiertos.
- Usualmente son accidentales o debidos al incumplimiento de las mejores prácticas de seguridad.

### Vulnerabilidades de Diseño
- Corresponden a fallos estructurales o arquitectónicos.
- Ejemplos: uso de algoritmos criptográficos débiles o falta de cifrado en tránsito o reposo.

### Vulnerabilidades de Red
- Las vulnerabilidades a nivel de red permiten al atacante acceder a la red interna.
- Ejemplos: puertos y firewalls débiles.

### Vulnerabilidades de Hardware
- Dispositivos físicos como por ejemplo routers, servidores o dispositivos USB, que pueden tener vulnerabilidades en su diseño que los ciberdelincuentes aprovechan.

### Vulnerabilidades Humanas
- Corresponde a la mayor causa de vulnerabilidades de ciberseguridad.
- Abrir enlaces de phishing, usar contraseñas fáciles de adivinar o falta de concientización son algunas de estas.

---

## ¿Qué es Gestión de Vulnerabilidades?

Gestión de vulnerabilidades corresponde a un proceso continuo y cíclico que permite a las organizaciones identificar, evaluar, priorizar y remediar debilidades y vulnerabilidades en la infraestructura de TI antes de que los atacantes puedan explotarlas.

### Pasos Esenciales

**Identificación** – Hacer uso de escáneres de vulnerabilidades, técnicas manuales y métodos de descubrimiento de equipos para identificar y registrar los sistemas, junto con cualquier problema de seguridad que presenten.

**Informes** – Informar sobre estos problemas a las partes interesadas para que puedan abordarse y, finalmente, resolverse.

**Corrección** – El propietario del sistema o el responsable técnico corrigen los problemas de seguridad para que la vulnerabilidad deje de existir. Se pueden utilizar diferentes métodos para corregir las vulnerabilidades, como parches de seguridad, reconfiguraciones o controles de mitigación.

**Reevaluación** – Escanear o verificar manualmente para asegurar que los problemas de seguridad se hayan corregido correctamente.

> **Punto clave**: Poder controlar los problemas de seguridad encontrados y asegurarse de que los productos se actualicen lo antes posible (normalmente después de las pruebas, para garantizar que no haya efectos no deseados derivados de la actualización) significa que los hackers tienen menos tiempo para intentar explotar las vulnerabilidades.

![](https://cdn.hashnode.com/uploads/covers/6a443c3a6ecaa7a89af0d14b/d22f7fd1-c7e3-4cc9-9776-0cda8bc3425b.png)

---

## Ciclo de Vida de la Gestión de Vulnerabilidades

El ciclo de vida de gestión de vulnerabilidades consta de 5 pasos principales:

| Paso | Enfoque |
|---|---|
| **Descubrimiento (Discovery)** | Identificar todos los activos (hardware + software) en el entorno. |
| **Evaluación (Assessment)** | Detectar vulnerabilidades usando escáneres, pentesting, threat intelligence (como por ejemplo OSINT). |
| **Priorización (Prioritization/Triage)** | Clasificar por riesgo usando gravedad + contexto organizacional. |
| **Resolución (Resolution)** | Remediar, mitigar o aceptar el riesgo. |
| **Verificación (Verification)** | Confirmar que la vulnerabilidad fue eliminada/mitigada; reevaluar. |

![](https://cdn.hashnode.com/uploads/covers/6a443c3a6ecaa7a89af0d14b/01c370da-c5a8-4525-8a28-3d66dc863181.png)

### Definición del Alcance para el Descubrimiento
- **Inventario de Activos (Asset Inventory)** – Es una lista completa de activos de hardware + software.
- **Métodos de Creación:**
  - **Manual**: Hoja de cálculo, recorriendo redes (orgs pequeñas, consume tiempo).
  - **Automatizado**: Herramientas de gestión de activos, escaneo de red, agentes desplegados.

### Métodos de Evaluación
- **Escáneres de Vulnerabilidades**
  - **Escáneres de Red (Network Scanners)** – Identifican sistemas operativos, software y sus versiones, y posteriormente los comparan con bases de datos de vulnerabilidades conocidas.
  - **Escáneres de Aplicaciones Web (Web Application Scanners)** – Detectan vulnerabilidades comunes en aplicaciones web, como Cross-Site Scripting (XSS), Path Traversal y ataques de inyección (por ejemplo, SQL Injection).
  - **Análisis Estático de Código (SAST)** – Analiza el código fuente para identificar patrones de programación inseguros, credenciales o secretos embebidos (hardcoded secrets) y otras debilidades de seguridad antes del despliegue.
  - **Evaluación de Configuración (Configuration Assessment)** – Detecta configuraciones inseguras en entornos como Active Directory, plataformas en la nube (AWS, Azure y GCP) y sistemas operativos, comparando la configuración con estándares de seguridad como los CIS Benchmarks y otras buenas prácticas.
- **Pruebas de Penetración (Penetration Testing)**
  - Consisten en un ciberataque simulado y autorizado diseñado para identificar vulnerabilidades que pueden ser explotadas por un atacante.
  - Proporcionan una perspectiva diferente a la de los escáneres automatizados, ya que validan si una vulnerabilidad puede explotarse en un entorno real.
  - Permiten verificar la efectividad de las acciones de remediación y de los controles compensatorios implementados.
  - Requieren autorización explícita antes de su ejecución. En entornos de nube, dependiendo del alcance y del tipo de pruebas, también puede ser necesario obtener la aprobación del proveedor del servicio en la nube.

---

## Priorización (Prioritization/Triage)

**No basarse solo en el score CVSS** — es importante incluir el contexto organizacional.

### Dos Consideraciones Clave

1. **Probabilidad de Explotación** – Los factores que aumentan la probabilidad de que una vulnerabilidad sea explotada incluyen:
   - La existencia de un proof of concept (PoC) o un exploit disponible públicamente (por ejemplo, en Exploit Database o GitHub).
   - Que la vulnerabilidad se encuentre en el catálogo CISA Known Exploited Vulnerabilities (KEV).
   - Puntaje alto en el Exploit Prediction Scoring System (EPSS), lo que indica una mayor probabilidad de que la vulnerabilidad sea explotada en entornos reales.
2. **Impacto Potencial si es Explotada** – Se deben evaluar las consecuencias de una explotación exitosa, incluyendo:
   - Impacto inmediato, como el compromiso de un sistema o la interrupción de un servicio.
   - Impacto diferido o encadenado, cuando la vulnerabilidad puede combinarse con otras para aumentar su impacto.
   - Exposición de datos, interrupción del servicio, escalamiento de privilegios u otras consecuencias críticas para el negocio.

### Categorización de Vulnerabilidades
Una vez que las vulnerabilidades han sido evaluadas y priorizadas, normalmente se clasifican en una de las siguientes categorías:
- **Corregir Inmediatamente** – Vulnerabilidades de alta prioridad que requieren una acción inmediata.
- **Reconocer pero diferir** – Vulnerabilidades cuyo riesgo se acepta de forma temporal y cuya remediación se programa para una fecha posterior.
- **Requiere Investigación Adicional** – Vulnerabilidades que necesitan un análisis más profundo antes de determinar el curso de acción más adecuado.

### Opciones de Resolución

| Opción | Descripción |
|---|---|
| **Remediar (Remediate)** | Eliminar completamente la vulnerabilidad mediante la aplicación de un parche de seguridad, una actualización de software, un cambio de configuración u otra solución permanente. |
| **Mitigar (Mitigate)** | Reducir la probabilidad o el impacto de la explotación sin eliminar por completo la vulnerabilidad (por ejemplo, implementando reglas de firewall, segmentación de red, deshabilitando servicios vulnerables o aplicando controles compensatorios). |
| **Aceptar (Accept)** | Reconocer y aceptar formalmente el riesgo cuando la remediación o la mitigación no sean viables. La aceptación del riesgo debe documentarse, ser aprobada por las partes interesadas correspondientes y revisarse periódicamente, ya que normalmente se considera una medida temporal. |

---

## Frameworks y Estándares Para Priorización

### 1. CVE (Common Vulnerabilities and Exposures)
Sistema de identificación único y universal para vulnerabilidades conocidas públicamente. Cada vulnerabilidad recibe un ID único en formato CVE-YYYY-NNNNN que permite que vendedores, herramientas y organizaciones hablen el mismo idioma. Mantenido por MITRE Corporation (financiado por gobierno EE.UU.).
- Opera mediante CNAs (CVE Numbering Authorities): organizaciones autorizadas para asignar IDs. Actualmente existen más de 300 CNAs distribuidos globalmente, incluyendo vendors principales, coordinadores de seguridad e investigadores certificados.
- **Uso en priorización** – Permite buscar información verificable sobre una vulnerabilidad específica, consultar si hay parches disponibles y verificar si está siendo explotada activamente. Sin CVE ID, diferentes herramientas reportan la misma vulnerabilidad con nombres distintos, causando confusión y duplicación de esfuerzos. Es la clave para buscar en bases de datos de exploits públicos y coordinar respuesta entre equipos.

### 2. CVSS (Common Vulnerability Scoring System)
Es un framework estandarizado para evaluar severidad de vulnerabilidades mediante puntuación numérica de 0.0 (sin impacto) a 10.0 (crítico). Mantenido por FIRST (Forum of Incident Response and Security Teams).
- Calcula el score usando 8 métricas base: Attack Vector (desde dónde), Attack Complexity (dificultad), Privileges Required (autenticación), User Interaction (intervención humana), Scope (cruza límites), Confidentiality/Integrity/Availability impact. También incluye métricas Temporales (cambian con el tiempo) y de Entorno (contexto organizacional).
- **Métricas de Explotabilidad**
  - Attack Vector (AV): Desde dónde se ataca – Network (remoto)/Adjacent (red local)/Local (acceso local)/Physical (acceso físico).
  - Attack Complexity (AC): Dificultad técnica – Low (fácil, sin condiciones especiales)/High (requiere configuración compleja).
  - Privileges Required (PR): Autenticación necesaria – None (sin auth)/Low (usuario básico)/High (admin/root).
  - User Interaction (UI): Intervención humana requerida – None (totalmente automatizado)/Required (usuario debe hacer algo).
- **Métricas de Impacto** – Miden el daño causado (CIA Triad + Scope).
  - Scope (S): ¿El exploit cruza límites de seguridad? – Unchanged (impacto dentro del mismo componente)/Changed (impacto cruza a otros componentes).
  - Confidentiality (C): Exposición de datos – None/Low (acceso limitado)/High (acceso completo).
  - Integrity (I): Modificación de datos – None/Low (modificación limitada)/High (control completo).
  - Availability (A): Denegación de servicio – None/Low (degradación)/High (sistema completamente caído).
- **Uso en priorización** – Proporciona evaluación técnica estandarizada de severidad base. **CRÍTICO**: NO usar solo CVSS. Mide severidad técnica teórica, NO riesgo real. CVSS 9.0 en sistema aislado puede ser menos prioritario que CVSS 7.0 en servidor público crítico. Siempre complementar con contexto organizacional: criticidad del activo, exposición real, datos manejados, impacto al negocio.
- **Limitación principal** – Mide impacto técnico, ignora probabilidad de explotación y el contexto organizacional.

### 3. CWE (Common Weakness Enumeration)
Sistema de clasificación que describe TIPOS o CLASES de vulnerabilidades, no vulnerabilidades individuales. Explica causas raíz y naturaleza fundamental de debilidades de seguridad. Es mantenido por MITRE Corporation.
- Organiza debilidades en jerarquía de 4 niveles:
  - **Pillar**: Categorías muy amplias (ej: Access Control).
  - **Class**: Tipos generales (ej: Improper Authorization).
  - **Base**: Identificables en código específico.
  - **Variant**: Específicos a plataforma/lenguaje.
- **Diferencia con CVE**
  - CVE: Instancia específica de vulnerabilidad en producto/versión particular.
  - CWE: Categoría abstracta del problema subyacente que puede manifestarse en múltiples productos.
- **Uso en priorización** – Identifica patrones sistémicos de vulnerabilidades recurrentes. Si múltiples CVEs en tu entorno mapean al mismo CWE, indica problema estructural que requiere solución fundamental más allá del parcheo individual: capacitación de developers, revisión de prácticas de desarrollo, implementación de análisis estático, o cambios arquitectónicos. Esencial para análisis de causa raíz.

### 4. CPE (Common Platform Enumeration)
Es un esquema de nomenclatura estandarizado para identificar productos de software y hardware de forma única. Elimina ambigüedad en nombres de productos que pueden tener múltiples representaciones textuales ("Apache Web Server" vs "httpd" vs "Apache HTTP Server"). Creado y mantenido por el NIST (National Institute of Standards and Technology).
- **Formato que utilizan** – URI estructurado con 11 componentes: `cpe:2.3:part:vendor:product:version:update:edition:language:sw_edition:target_sw:target_hw:other`
  - Ejemplo: `cpe:2.3:a:apache:http_server:2.4.49:*:*:*:*:*:*:*`
- **Uso en priorización** – Permite búsquedas precisas de vulnerabilidades por producto/versión en bases de datos como NVD. Escáneres automatizados usan CPE internamente para matchear software detectado con CVEs conocidos. Fundamental para automatización: sin CPE, sería necesario mapeo manual entre nombres y vulnerabilidades. Esencial para inventario de activos y Software Bill of Materials (SBOM).
- **Limitación principal** – CPEs creados manualmente por analistas (pueden tener errores). Software muy nuevo puede no tener CPE asignado. Algunos productos tienen múltiples representaciones CPE válidas.

### 5. CISA KEV (Known Exploited Vulnerabilities Catalog)
Catálogo autoritativo de vulnerabilidades con evidencia confiable y verificada de explotación ACTIVA en ataques reales. Creado por CISA (Cybersecurity and Infrastructure Security Agency – gobierno EE.UU.). Se basa en inteligencia de amenazas, reportes de incidentes y análisis de campañas maliciosas.
- Establece fechas límite OBLIGATORIAS de remediación para agencias federales estadounidenses. Por lo cual, KEV se convierte en un requisito de compliance para sector público de Estados Unidos.
- **Uso en priorización** – Si una vulnerabilidad aparece en KEV, existe evidencia confirmada de explotación activa por actores maliciosos reales. Remediar inmediatamente independientemente del score CVSS, criticidad del sistema o disponibilidad de workarounds. La explotación activa significa que la ventana para prevenir compromiso se cierra rápidamente.

Aunque es obligatorio solo para agencias federales de Estados Unidos, organizaciones privadas y de otros países deben usarlo como indicador de amenaza inminente. Si atacantes explotan contra el gobierno, en algún momento se podrán mover hacia el sector privado.

### 6. EPSS (Exploit Prediction Scoring System)
Sistema de scoring probabilístico basado en machine learning que predice la PROBABILIDAD (0% a 100%) de que una vulnerabilidad sea explotada en los próximos 30 días. Creado por el FIRST (Forum of Incident Response and Security Teams). Analiza múltiples señales como la disponibilidad de código de exploit público, menciones en listas de correo de seguridad, discusiones en redes sociales, actividad en repositorios de código, tendencias históricas de explotación. Modelo entrenado continuamente con datos históricos.

A diferencia de CVSS (estático), EPSS cambia diariamente según evoluciona el panorama de amenazas. Una vulnerabilidad puede tener EPSS bajo inicialmente pero subir si se publica exploit funcional.

- **Complemento del CVSS:**
  - CVSS responde: "¿Qué tan malo sería si fuera explotado?" (Impacto)
  - EPSS responde: "¿Qué tan probable es que sea explotado pronto?" (Probabilidad)
  - Fórmula: Riesgo Real = Impacto (CVSS) × Probabilidad (EPSS)
- **Uso en priorización** – Permite priorización basada en riesgo real cuando recursos son limitados. CVSS 9.0 + EPSS 0.1% = menos riesgo inmediato que CVSS 7.0 + EPSS 95%. Maximiza reducción de riesgo por unidad de esfuerzo atacando primero alta probabilidad de explotación.

### 7. NVD (National Vulnerability Database)
Base de datos comprensiva que enriquece entradas CVE básicas con análisis detallado y contexto adicional. Mantenido por el NIST (National Institute of Standards and Technology – gobierno EE.UU.). Permite filtrar por: producto específico (CPE), rango de severidad (CVSS), tipo de debilidad (CWE), fecha de publicación, vendor, o combinaciones múltiples.
- **Valor agregado sobre CVE.org:**
  - Scores CVSS oficiales calculados por analistas NIST.
  - Mapeos a CWE (tipo de debilidad).
  - CPEs afectados (productos/versiones).
  - Timelines detalladas (descubrimiento-publicación-patch).
  - Configuraciones específicas de explotabilidad.
  - Historial de cambios.
- **Uso en priorización** – Fuente centralizada para investigación detallada de vulnerabilidades identificadas (vía escáneres o pentesting). Consultar score CVSS oficial, entender tipo de debilidad (CWE), verificar versiones afectadas exactas, encontrar parches/workarounds, comprender vector de ataque. API permite automatización crítica: dashboards, alertas automáticas para nuevos CVEs en productos de tu inventario, reportes de compliance.

---

## Herramientas Útiles en Gestión de Vulnerabilidades

Ejemplos de herramientas que se pueden utilizar para aprender sobre gestión de vulnerabilidades, algunas son open-source y otras tienen versiones gratuitas de prueba.

### 1. Nessus Essentials
[Nessus Essentials](https://docs.tenable.com/nessus/Content/InstallNessus.htm) es un producto gratuito de Tenable que permite realizar una evaluación de vulnerabilidades a través de una licencia de 30 días, diseñada específicamente para uso personal o no comercial. Es ideal para evaluaciones a corto plazo, pruebas de concepto (PoC) o para proteger una red doméstica pequeña. No está diseñado para entornos empresariales o de producción. Con esta licencia, se pueden escanear hasta 5 direcciones IP y obtener información detallada sobre vulnerabilidades y recomendaciones para su corrección.

### 2. OPENVAS
[OPENVAS](https://www.openvas.org/) es un escáner de vulnerabilidades creado por Greenbone. Este escáner puede detectar variedad de vulnerabilidades. Permite realizar varios tipos de escaneos como por ejemplo autenticados y no autenticados, entre otros tipos de pruebas que sirven para la detección de vulnerabilidades. Una limitación de OPENVAS es que su capacidad de escaneo depende del modelo del appliance y de sus recursos.

### 3. Nmap
[Nmap](https://nmap.org/nsedoc/scripts/vulners.html) es la abreviatura de "Network Mapper". Permite encontrar qué dispositivos se están ejecutando en su red local, detectar vulnerabilidades y descubrir puertos y servicios abiertos. Para poder detectar vulnerabilidades se debe hacer uso del script llamado `vulners`, para cada CPE disponible, el script imprime las vulnerabilidades conocidas (con enlaces a la información correspondiente) y sus puntuaciones CVSS.

---

## ¿Por qué es Importante la Gestión de Vulnerabilidades?

En lo que va del presente año, se han publicado 36,141 CVEs, lo cual corresponde a un promedio de 199 por día. En el 2025 se publicaron 48.167 CVEs, con un promedio de 132 por día. Según los datos de IBM, el costo promedio de una brecha de seguridad ha alcanzado los $4,4 millones a nivel mundial. Algunas vulnerabilidades críticas son explotadas en cuestión de horas, no días como solía ser anteriormente. El tiempo entre el descubrimiento y el patch es cada vez más corto.

## Recursos Adicionales
- **CVE Program**: https://cve.org/
- **CVSS (FIRST)**: https://www.first.org/cvss/
- **CWE (MITRE)**: https://cwe.mitre.org/
- **CPE (NIST)**: https://nvd.nist.gov/products/cpe
- **CISA KEV**: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- **EPSS (FIRST)**: https://www.first.org/epss/
- **NVD (NIST)**: https://nvd.nist.gov/

### Referencias
1. "Tipos de vulnerabilidades en ciberseguridad [2026] Inforges". INFORGES. https://inforges.es/blog/tipos-de-vulnerabilidades-en-ciberseguridad/
2. "Vulnerabilidades de ciberseguridad: prevención y mitigación". SentinelOne. https://www.sentinelone.com/es/cybersecurity-101/cybersecurity/cyber-security-vulnerabilities/
3. "Niveles de gravedad de las incidencias de seguridad | Atlassian". https://www.atlassian.com/es/trust/security/security-severity-levels
4. "¿Qué es la gestión de vulnerabilidades? Mejores prácticas y desafíos". Zscaler. https://www.zscaler.com/es/zpedia/what-is-vulnerability-management
5. "Gestión de vulnerabilidades: una guía práctica". Kaseya. https://www.kaseya.com/es-la/blog/vulnerability-management/
6. IBM. "¿Qué es la gestión de vulnerabilidades?". https://www.ibm.com/es-es/think/topics/vulnerability-management
7. "¿Qué es la gestión de vulnerabilidades? | Tenable". https://es-la.tenable.com/principles/vulnerability-management-principles
8. M. Kosinski. "¿Qué es el ciclo de vida de la gestión de vulnerabilidades? | IBM". https://www.ibm.com/mx-es/think/topics/vulnerability-management-lifecycle
9. "Ciclo de vida de la gestión de vulnerabilidades: una guía sencilla". SentinelOne. https://www.sentinelone.com/es/cybersecurity-101/cybersecurity/vulnerability-management-lifecycle/
10. "What is Vulnerability Management Lifecycle?" Pathlock. https://pathlock.com/blog/vulnerability-management-lifecycle/
11. T. Khan y M. Goodwin. "What Is CVE?". IBM. https://www.ibm.com/think/topics/cve
12. A. Gomstyn y A. Jonker. "¿Qué es CVSS? | IBM". https://www.ibm.com/mx-es/think/topics/cvss
13. "What Is a Common Weakness Enumeration (CWE)?" JumpCloud. https://jumpcloud.com/it-index/what-is-a-common-weakness-enumeration-cwe
14. "What is Common Platform Enumeration (CPE)?" Hexnode. https://www.hexnode.com/blogs/explained/what-is-common-platform-enumeration-cpe/
15. S. Ö. Hacıoğlu. "What Is KEV?" Picus Security. https://www.picussecurity.com/resource/blog/what-is-kev-known-exploited-vulnerabilities-catalog
16. "Exploit Prediction Scoring System (EPSS) | Splunk". https://www.splunk.com/en_us/blog/learn/epss-exploit-prediction-scoring-system.html
17. "What is the National Vulnerability Database (NVD)? | Fortinet". https://www.fortinet.com/resources/cyberglossary/national-vulnerability-database-nvd
18. "What's the Average Cost of a Data Breach in 2025? | Huntress". https://www.huntress.com/blog/average-cost-of-a-data-breach
19. J. Krell. "Mean Time to Exploit Has Gone Negative". Suzu Labs. https://suzulabs.com/suzu-labs-blog/mean-time-to-exploit-has-gone-negative.-security-strategy-has-to-change
20. "CVE.ICU - CVE Analysis Dashboard". https://cve.icu/years.html
