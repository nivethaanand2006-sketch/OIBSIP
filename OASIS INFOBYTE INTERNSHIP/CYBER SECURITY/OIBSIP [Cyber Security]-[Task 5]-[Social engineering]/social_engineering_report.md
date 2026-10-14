# Social Engineering Attacks: Phishing, Pretexting and Baiting

*OIBSIP · Security Analyst · Task 5*

## 1. Introduction
Social engineering is the manipulation of people into giving up information, access or money. Instead of breaking a technical control, the attacker persuades a human to bypass it. It is one of the most effective attack vectors because it targets trust, urgency and helpfulness, which no firewall can patch. Verizon's Data Breach Investigations Report has repeatedly found that the human element is involved in a large share of breaches (about two-thirds in the 2024 edition), and phishing is among the most common initial access methods.

## 2. Phishing
**Types**
- **Phishing:** mass emails imitating a trusted brand.
- **Spear phishing:** targeted at one person or team, using personal details.
- **Whaling:** spear phishing aimed at senior executives.
- **Vishing:** voice calls; **Smishing:** SMS messages.

**How it works.** The attacker sends a convincing message with a link or attachment that harvests credentials or installs malware, usually pressing the victim to act quickly.

**Case study: RSA, 2011.** Attackers sent spear-phishing emails to small groups of RSA employees with an Excel attachment titled as a recruitment plan. The file exploited an Adobe Flash vulnerability and gave the attackers a foothold, which led to the theft of information related to RSA's SecurID authentication products.

**Prevention**
1. Train staff to inspect sender addresses and hover over links before clicking.
2. Enable multi-factor authentication, ideally phishing-resistant (FIDO2/passkeys).
3. Use email filtering, link rewriting and attachment sandboxing.
4. Provide an easy "report phishing" button and reward reporting.

## 3. Pretexting
**Definition.** The attacker invents a believable scenario (a pretext), such as pretending to be IT support, a vendor or an executive, to persuade the victim to reveal information.

**How it builds a false scenario.** The attacker researches the target (LinkedIn, company site), adopts a role and vocabulary, creates a reason for the request, and often escalates in small steps.

**Case study: Hewlett-Packard, 2006.** Investigators hired by HP to find the source of boardroom leaks impersonated directors and journalists to obtain their phone records from carriers. The scandal led to resignations, criminal charges and new US legislation against pretexting for phone records.

**Prevention**
1. Verify identity through an independent channel (call back using a known number).
2. Define clear procedures for sensitive requests (password resets, payments) that do not rely on personal knowledge.
3. Limit what staff and carriers can disclose by phone and log each request.

## 4. Baiting
**Digital and physical baiting.** The attacker offers something tempting: a USB drive labelled "Salaries" left in a car park, a free movie or software download that contains malware, or a fake giveaway.

**Case study: Operation Buckshot Yankee, 2008.** US Deputy Secretary of Defense William Lynn later wrote that a malicious flash drive inserted into a military laptop at a base in the Middle East spread malware across US military networks, which led to major changes in USB policy.

**Prevention**
1. Disable autorun and restrict removable media through endpoint policy.
2. Teach staff never to plug in found devices; hand them to security.
3. Download software only from official sources and scan files before opening.

## 5. Quid Pro Quo (bonus)
The attacker offers a service or benefit in exchange for information, for example a caller claiming to be "IT support" who will fix a problem if the victim disables security software or shares a password. **Prevention:** staff should only accept support via official ticketing channels and never share credentials with callers.

## 6. Comparison

| Attack type | Primary target | Psychological lever | Best countermeasure |
|---|---|---|---|
| Phishing | Any employee or customer | Urgency, fear, curiosity | MFA plus awareness training and reporting |
| Pretexting | Helpdesk, finance, HR, call centres | Authority, helpfulness | Out-of-band verification procedures |
| Baiting | Curious or less security-aware staff | Curiosity, greed | Removable-media controls plus training |
| Quid pro quo | Non-technical staff | Reciprocity, wanting help | Official support channels only |

## 7. Employee security-awareness checklist
1. Pause before acting on any urgent request for money, credentials or data.
2. Verify the sender using a separate, trusted channel.
3. Never plug in unknown USB devices or install unapproved software.
4. Use a password manager and MFA on every account that supports it.
5. Report suspicious messages immediately; reporting is never "wasting time".

## 8. References
1. Verizon, *Data Breach Investigations Report* (latest edition), verizon.com/business/resources/reports/dbir.
2. CISA, *Avoiding Social Engineering and Phishing Attacks*, cisa.gov.
3. Uri Rivner (RSA), *Anatomy of an Attack*, RSA blog, April 2011.
4. W. J. Lynn III, "Defending a New Domain: The Pentagon's Cyberstrategy," *Foreign Affairs*, Sept/Oct 2010.
5. US House Committee on Energy and Commerce hearings on the HP pretexting scandal, September 2006.
6. MITRE ATT&CK, *T1566 Phishing*, attack.mitre.org.


