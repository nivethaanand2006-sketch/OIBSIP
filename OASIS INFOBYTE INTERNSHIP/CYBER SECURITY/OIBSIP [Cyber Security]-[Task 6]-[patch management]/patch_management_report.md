# The Importance of Patch Management

*OIBSIP · Security Analyst · Task 6*

## 1. Introduction
Patch management is the process of identifying, acquiring, testing, installing and verifying software updates that fix security vulnerabilities and bugs. In the vulnerability lifecycle, a flaw is discovered, the vendor releases a patch, and defenders race attackers to apply it before the flaw is exploited. Unpatched systems remain one of the largest and most avoidable attack surfaces.

## 2. Why patches matter
**Discovery and disclosure.** Vulnerabilities are found by vendors, researchers and attackers. Public flaws are assigned a **CVE** identifier (for example CVE-2017-0144) in the Common Vulnerabilities and Exposures system, and their severity is scored 0–10 with **CVSS**. Once a patch ships, attackers can compare the fixed and unfixed code to build exploits quickly, so the time between patch release and exploitation is often short.

**Real-world breach 1: WannaCry (2017).** Microsoft released the MS17-010 update in March 2017 to fix the SMB flaw exploited by the EternalBlue tool. In May 2017 the WannaCry ransomware worm used that flaw to infect hundreds of thousands of computers across about 150 countries. England's National Health Service was heavily disrupted; the UK National Audit Office reported that at least 81 of 236 trusts were affected. Systems that had applied the patch were protected.

**Real-world breach 2: Equifax (2017).** Attackers exploited a flaw in Apache Struts (CVE-2017-5638), for which a fix had been available for about two months. Personal data of roughly 147 million people was exposed. Equifax later agreed to a settlement of up to USD 700 million with US regulators.

## 3. Consequences of not patching
- **Data breaches:** theft of personal and financial data (Equifax).
- **Ransomware:** outages and ransom demands (WannaCry).
- **Compliance violations:** frameworks such as PCI DSS and HIPAA expect timely patching.
- **Financial penalties:** IBM's *Cost of a Data Breach Report 2024* put the global average cost of a breach at about USD 4.88 million.
- **Reputation damage:** lost customer trust that is expensive to rebuild.

## 4. Patch management lifecycle
1. **Discovery:** maintain an asset inventory and monitor vendor advisories, CVE feeds and CISA's Known Exploited Vulnerabilities catalogue.
2. **Assessment:** decide which patches apply, using CVSS score, exploit availability and the importance of the affected asset.
3. **Testing:** try the patch on a test group or staging system to catch compatibility problems.
4. **Deployment:** roll out in phases using automated tools, with a maintenance window and rollback plan.
5. **Verification:** confirm that the patch installed, scan again for the vulnerability, and record the result for audits.

## 5. Best practices: prioritised 7-step checklist
1. Build and maintain a complete, current asset inventory.
2. Subscribe to vendor and CISA advisories for everything you run.
3. Prioritise by risk: actively exploited and internet-facing systems first.
4. Test patches in a staging environment that mirrors production.
5. Automate deployment and set target timelines (for example: critical within days, high within weeks).
6. Have an emergency process and compensating controls (isolation, firewall rules, virtual patching) when you cannot patch immediately.
7. Verify with vulnerability scans, track metrics (time to patch, coverage) and report them.

## 6. Challenges and how to overcome them

| Challenge | Why it happens | How to overcome it |
|---|---|---|
| Legacy systems | Vendor no longer supports the software | Isolate on a segmented network, apply compensating controls, plan replacement |
| Downtime concerns | Critical systems cannot stop | Schedule maintenance windows, use redundancy and rolling updates |
| Testing effort | Patches can break applications | Automate regression tests and use a staging environment |
| Poor visibility | Unknown or shadow IT assets | Run discovery scans and keep an asset inventory |
| Limited staff | Large patch volume | Prioritise by risk and automate routine updates |

## 7. Conclusion
Most major breaches caused by unpatched flaws were preventable because the fix already existed. A disciplined, risk-based patch process with good inventory, testing and verification is one of the most cost-effective security measures available.

## 8. References
1. NIST, *SP 800-40 Rev. 4: Guide to Enterprise Patch Management Planning*, 2022, csrc.nist.gov.
2. CISA, *Known Exploited Vulnerabilities Catalog*, cisa.gov/known-exploited-vulnerabilities-catalog.
3. MITRE, *CVE Program*, cve.org; FIRST, *Common Vulnerability Scoring System (CVSS)*, first.org/cvss.
4. Microsoft, *Security Bulletin MS17-010*, March 2017.
5. UK National Audit Office, *Investigation: WannaCry cyber attack and the NHS*, 2017.
6. US Government Accountability Office, *Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach*, GAO-18-559, 2018.
7. IBM, *Cost of a Data Breach Report 2024*.

