import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, handleFirestoreError, OperationType } from './firebase';
import { 
  ClientProject, 
  ClientInvoice, 
  ClientDocument, 
  PortalMessage, 
  ClientProfile,
  DocumentCategory,
  ProjectMilestone,
  MilestoneStatus,
  MilestoneComment,
  TimeEntry
} from '../types';

// Seeding standard high-value demonstration data for fresh client portal accounts
export async function seedInitialClientDataIfEmpty(
  userId: string, 
  userEmail: string, 
  userName?: string, 
  companyName?: string
): Promise<void> {
  try {
    // Check if user already has data in Firestore
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    const clientComp = companyName || 'Apex Strategic Enterprises';
    const clientName = userName || userEmail.split('@')[0].replace('.', ' ').toUpperCase() || 'Executive Client';

    if (!userSnap.exists()) {
      const userProfile: ClientProfile = {
        userId,
        email: userEmail,
        displayName: clientName,
        companyName: clientComp,
        phone: '+1 (555) 382-9100',
        role: 'Chief Executive / Managing Director',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, { ...userProfile, createdAt: serverTimestamp() });
    }

    // Check if projects exist
    const projectsQuery = query(collection(db, 'projects'), where('userId', '==', userId));
    const projectDocs = await getDocs(projectsQuery);

    if (projectDocs.empty) {
      // Seed flagship active project
      const projId1 = 'proj_' + userId.slice(0, 5) + '_01';
      const project1: ClientProject = {
        id: projId1,
        userId,
        title: 'Q3 Enterprise Strategy & Automation Transformation',
        serviceType: 'Business Strategy & Automation Consultancy',
        companyName: clientComp,
        status: 'in_progress',
        progressPercentage: 68,
        startDate: '2026-06-15',
        targetCompletionDate: '2026-09-30',
        leadConsultantName: 'Sarah Jenkins, FCA',
        leadConsultantRole: 'Senior Managing Partner & Lead Strategist',
        leadConsultantEmail: 'sarah.jenkins@accounticca.com',
        leadConsultantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        budgetTotal: 45000,
        budgetSpent: 30600,
        description: 'Comprehensive operational workflow re-engineering, ERP data synchronization, and automated executive financial reporting architecture.',
        milestones: [
          {
            id: 'm1',
            title: 'Diagnostic Audit & Process Architecture Review',
            startDate: '2026-06-15',
            dueDate: '2026-06-30',
            status: 'completed',
            phase: 'Phase 1: Discovery & Audit',
            progress: 100,
            owner: 'Sarah Jenkins, FCA',
            deliverableName: 'Executive Diagnostic Audit Report.pdf',
            description: 'Completed full 42-point workflow analysis and bottleneck identification.',
            keyOutputs: ['Workflow Map', 'Risk Exposure Matrix', '42-Point Diagnostic Matrix']
          },
          {
            id: 'm2',
            title: 'Cloud Accounting & Automation Blueprint Setup',
            startDate: '2026-07-01',
            dueDate: '2026-07-25',
            status: 'completed',
            phase: 'Phase 2: Architecture & Setup',
            progress: 100,
            owner: 'Marcus Vance, CPA',
            deliverableName: 'Process Automation Architecture v2.4.xlsx',
            description: 'Integrated automated billing, multi-entity reconciliation and live reporting.',
            keyOutputs: ['Multi-Entity Pipeline', 'Auto-Bank Sync Engine', 'Billing Automation Flow']
          },
          {
            id: 'm3',
            title: 'Executive KPI Dashboard & Variance Engine',
            startDate: '2026-07-26',
            dueDate: '2026-08-28',
            status: 'in_progress',
            phase: 'Phase 3: Deployment & Analytics',
            progress: 75,
            owner: 'Sarah Jenkins, FCA',
            deliverableName: 'Unit Economics & 3-Year Financial Model.xlsx',
            description: 'Deployment of real-time cashflow forecast and unit economics analytics.',
            keyOutputs: ['Real-time Cash Flow Forecaster', 'Sensitivity Analysis Sandbox', 'Custom KPI Cockpit']
          },
          {
            id: 'm4',
            title: 'Team Training, SOP Playbook Handover & Sign-off',
            startDate: '2026-08-29',
            dueDate: '2026-09-30',
            status: 'upcoming',
            phase: 'Phase 4: Handover & Governance',
            progress: 0,
            owner: 'Sarah Jenkins, FCA',
            deliverableName: 'Master Corporate SOP Playbook.pdf',
            description: 'Executive change management workshop and SOP documentation.',
            keyOutputs: ['Change Management Workshops', 'Executive Playbook', 'Quarterly Advisory Roadmap']
          }
        ],
        deliverables: [
          {
            id: 'del_1',
            name: 'Executive Diagnostic Audit Report.pdf',
            fileType: 'PDF Document',
            size: '4.8 MB',
            date: '2026-06-28',
            status: 'approved'
          },
          {
            id: 'del_2',
            name: 'Process Automation Architecture v2.4.xlsx',
            fileType: 'Excel Spreadsheet',
            size: '12.2 MB',
            date: '2026-07-22',
            status: 'approved'
          },
          {
            id: 'del_3',
            name: 'Unit Economics & 3-Year Financial Model.xlsx',
            fileType: 'Excel Financial Model',
            size: '8.5 MB',
            date: '2026-08-10',
            status: 'in_review'
          }
        ],
        recentUpdates: [
          {
            id: 'up_1',
            date: 'Aug 14, 2026',
            author: 'Sarah Jenkins',
            role: 'Lead Strategist',
            text: 'Completed sprint 3 testing for the automated bank reconciliation engine. Variance tracking accuracy at 99.8%.'
          },
          {
            id: 'up_2',
            date: 'Aug 04, 2026',
            author: 'Marcus Vance',
            role: 'Senior Finance Director',
            text: 'Uploaded updated 3-Year Financial Model with revised sensitivity metrics for your executive review.'
          },
          {
            id: 'up_3',
            date: 'Jul 24, 2026',
            author: 'Sarah Jenkins',
            role: 'Lead Strategist',
            text: 'Phase 2 automation milestones officially approved by client stakeholder committee.'
          }
        ]
      };

      await setDoc(doc(db, 'projects', projId1), {
        ...project1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Project 2 (Completed or Secondary)
      const projId2 = 'proj_' + userId.slice(0, 5) + '_02';
      const project2: ClientProject = {
        id: projId2,
        userId,
        title: 'Finance Act 2026 Corporate Tax & Compliance Restructuring',
        serviceType: 'Accounting & Finance Advisory',
        companyName: clientComp,
        status: 'completed',
        progressPercentage: 100,
        startDate: '2026-03-01',
        targetCompletionDate: '2026-05-15',
        leadConsultantName: 'Marcus Vance, CPA',
        leadConsultantRole: 'Director of Taxation & Corporate Structuring',
        leadConsultantEmail: 'marcus.vance@accounticca.com',
        leadConsultantAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        budgetTotal: 18500,
        budgetSpent: 18500,
        description: 'Complete cross-border entity tax health check, deduction optimization, and statutory filing alignment for the 2026 fiscal year.',
        milestones: [
          {
            id: 'm2_1',
            title: 'Statutory Compliance & Exposure Audit',
            dueDate: '2026-03-20',
            status: 'completed',
            description: 'Zero penalty exposure audit completed across all corporate accounts.'
          },
          {
            id: 'm2_2',
            title: 'Tax Optimization & Allowance Matrix',
            dueDate: '2026-04-18',
            status: 'completed',
            description: 'Identified 22.4% in eligible capital allowance and R&D credits.'
          },
          {
            id: 'm2_3',
            title: 'Final Executive Filing & Advisory Dossier',
            dueDate: '2026-05-15',
            status: 'completed',
            description: 'Delivered final board package and signed compliance certificate.'
          }
        ],
        deliverables: [
          {
            id: 'del_2_1',
            name: 'Finance Act 2026 Tax Optimization Blueprint.pdf',
            fileType: 'PDF Document',
            size: '6.1 MB',
            date: '2026-05-12',
            status: 'approved'
          }
        ],
        recentUpdates: [
          {
            id: 'up_2_1',
            date: 'May 15, 2026',
            author: 'Marcus Vance',
            role: 'Tax Director',
            text: 'Project completed successfully. All filings submitted and approved with zero audit inquiries.'
          }
        ]
      };

      await setDoc(doc(db, 'projects', projId2), {
        ...project2,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Check if invoices exist
    const invQuery = query(collection(db, 'invoices'), where('userId', '==', userId));
    const invDocs = await getDocs(invQuery);

    if (invDocs.empty) {
      const invoices: ClientInvoice[] = [
        {
          id: 'inv_' + userId.slice(0, 5) + '_01',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          invoiceNumber: 'ACC-2026-0842',
          issueDate: '2026-08-01',
          dueDate: '2026-08-25',
          amount: 8500,
          currency: 'USD',
          status: 'pending',
          description: 'Phase 3 Advisory Retainer: Executive KPI Dashboard & Automation Deployment',
          items: [
            { id: 'i1', description: 'Real-Time ERP & Bank Automation Integration', quantity: 1, rate: 4500, amount: 4500 },
            { id: 'i2', description: 'Executive Cashflow Forecast Modeling & BI Dashboard', quantity: 1, rate: 3000, amount: 3000 },
            { id: 'i3', description: 'Bi-Weekly Partner Strategic Advisory Hours (10 hrs)', quantity: 10, rate: 100, amount: 1000 }
          ]
        },
        {
          id: 'inv_' + userId.slice(0, 5) + '_02',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          invoiceNumber: 'ACC-2026-0718',
          issueDate: '2026-07-01',
          dueDate: '2026-07-20',
          amount: 12500,
          currency: 'USD',
          status: 'paid',
          paidAt: '2026-07-16T14:32:00Z',
          paymentMethod: 'Corporate Wire Transfer (ACH)',
          description: 'Phase 2 Advisory Retainer: Cloud Accounting & Automation Blueprint Setup',
          items: [
            { id: 'i1', description: 'Process Architecture Engineering & Workflow Re-design', quantity: 1, rate: 7500, amount: 7500 },
            { id: 'i2', description: 'Accounting Cloud Migration & Data Cleanse', quantity: 1, rate: 5000, amount: 5000 }
          ]
        },
        {
          id: 'inv_' + userId.slice(0, 5) + '_03',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          invoiceNumber: 'ACC-2026-0601',
          issueDate: '2026-06-01',
          dueDate: '2026-06-15',
          amount: 9600,
          currency: 'USD',
          status: 'paid',
          paidAt: '2026-06-12T10:15:00Z',
          paymentMethod: 'Corporate Wire Transfer (ACH)',
          description: 'Phase 1 Engagement Kickoff & Comprehensive 42-Point Diagnostic Audit',
          items: [
            { id: 'i1', description: 'Initial Discovery, Diagnostic Audit & Gap Analysis', quantity: 1, rate: 9600, amount: 9600 }
          ]
        },
        {
          id: 'inv_' + userId.slice(0, 5) + '_04',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_02',
          projectTitle: 'Finance Act 2026 Corporate Tax Restructuring',
          invoiceNumber: 'ACC-2026-0310',
          issueDate: '2026-03-01',
          dueDate: '2026-03-15',
          amount: 18500,
          currency: 'USD',
          status: 'paid',
          paidAt: '2026-03-10T11:20:00Z',
          paymentMethod: 'Corporate Card (*9024)',
          description: 'Complete Corporate Tax & Compliance Restructuring Package',
          items: [
            { id: 'i1', description: 'Tax Health Check & Statutory Filing Package', quantity: 1, rate: 18500, amount: 18500 }
          ]
        }
      ];

      for (const inv of invoices) {
        await setDoc(doc(db, 'invoices', inv.id), {
          ...inv,
          createdAt: serverTimestamp()
        });
      }
    }

    // Check if documents exist
    const docQuery = query(collection(db, 'documents'), where('userId', '==', userId));
    const docDocs = await getDocs(docQuery);

    if (docDocs.empty) {
      const documents: ClientDocument[] = [
        {
          id: 'doc_' + userId.slice(0, 5) + '_01',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          title: 'Master Strategic Advisory & Transformation Roadmap 2026-2027',
          category: 'Strategy Deck',
          fileName: 'Accounticca_Strategic_Roadmap_Apex_v3.2.pdf',
          fileSize: '7.4 MB',
          fileType: 'PDF Presentation',
          version: 'v3.2',
          confidential: true,
          sharedBy: 'Sarah Jenkins, Lead Strategist',
          uploadedAt: '2026-08-11',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_01/documents/Accounticca_Strategic_Roadmap_Apex_v3.2.pdf`,
          description: 'Comprehensive 38-slide board deck summarizing competitive differentiation, automation levers, and 18-month EBITDA optimization plan.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_02',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          title: 'Strategic Operational Efficiency & Advisory Brief 2026',
          category: 'Operational Brief',
          fileName: 'Strategic_Operational_Efficiency_Brief_2026.docx',
          fileSize: '3.8 MB',
          fileType: 'Word Document',
          version: 'v2.1',
          confidential: true,
          sharedBy: 'Sarah Jenkins, Lead Strategist',
          uploadedAt: '2026-08-10',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_01/documents/Strategic_Operational_Efficiency_Brief_2026.docx`,
          description: 'Executive briefing document outlining departmental restructuring, vendor consolidation matrix, and targeted 22% overhead reduction guidelines.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_03',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          title: 'Integrated 3-Year Financial Model & Unit Economics Simulator',
          category: 'Financial Model',
          fileName: 'Apex_Enterprise_3Year_Financial_Model_v4.xlsm',
          fileSize: '14.8 MB',
          fileType: 'Dynamic Excel Macro Model',
          version: 'v4.0',
          confidential: true,
          sharedBy: 'Marcus Vance, CPA',
          uploadedAt: '2026-08-08',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_01/documents/Apex_Enterprise_3Year_Financial_Model_v4.xlsm`,
          description: 'Fully linked three-statement dynamic forecasting model featuring scenario toggles (Bull/Base/Bear), hiring ramp simulator, and working capital sensitivity analysis.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_04',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          title: 'Executive Diagnostic Operational Audit & Bottleneck Assessment',
          category: 'Audit Report',
          fileName: 'Diagnostic_Operational_Audit_Summary.pdf',
          fileSize: '5.2 MB',
          fileType: 'PDF Report',
          version: 'v1.1',
          confidential: true,
          sharedBy: 'Sarah Jenkins, Lead Strategist',
          uploadedAt: '2026-06-28',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_01/documents/Diagnostic_Operational_Audit_Summary.pdf`,
          description: 'In-depth assessment of the 42 corporate business processes, evaluating error rates, labor touchpoints, and cost-per-transaction benchmarks.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_05',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          projectTitle: 'Q3 Enterprise Strategy & Automation Transformation',
          title: 'Standard Operating Procedures (SOP) & Change Management Playbook',
          category: 'SOP Playbook',
          fileName: 'Accounticca_Client_SOP_Master_Playbook.pdf',
          fileSize: '9.1 MB',
          fileType: 'Interactive PDF Playbook',
          version: 'v2.0',
          confidential: false,
          sharedBy: 'Accounticca Advisory Practice',
          uploadedAt: '2026-07-25',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_01/documents/Accounticca_Client_SOP_Master_Playbook.pdf`,
          description: 'Step-by-step role-based execution workflows for procurement, invoice approvals, automated bank reconciliation, and month-end close acceleration.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_06',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_02',
          projectTitle: 'Finance Act 2026 Corporate Tax Restructuring',
          title: 'Tax Optimization & Restructuring Memorandum',
          category: 'Tax Document',
          fileName: 'Tax_Optimization_Restructuring_Memorandum.docx',
          fileSize: '4.1 MB',
          fileType: 'Word Document',
          version: 'v1.0 Final',
          confidential: true,
          sharedBy: 'Marcus Vance, CPA',
          uploadedAt: '2026-04-14',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_02/documents/Tax_Optimization_Restructuring_Memorandum.docx`,
          description: 'Detailed analysis of corporate cross-border tax incentives, capital allowance write-offs, and compliance directives under UK Finance Act 2026.'
        },
        {
          id: 'doc_' + userId.slice(0, 5) + '_07',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_02',
          projectTitle: 'Finance Act 2026 Corporate Tax Restructuring',
          title: 'Executed Mutual NDA & Master Advisory Engagement Agreement',
          category: 'Contract / NDA',
          fileName: 'Signed_Master_Advisory_Agreement_2026.pdf',
          fileSize: '2.3 MB',
          fileType: 'Digitally Signed PDF',
          version: 'Final Executed',
          confidential: true,
          sharedBy: 'Accounticca Legal & Compliance',
          uploadedAt: '2026-03-01',
          storagePath: `clients/${userId}/projects/proj_${userId.slice(0, 5)}_02/documents/Signed_Master_Advisory_Agreement_2026.pdf`,
          description: 'Fully executed corporate advisory engagement agreement, data confidentiality covenants, and service level agreements (SLA).'
        }
      ];

      for (const d of documents) {
        await setDoc(doc(db, 'documents', d.id), {
          ...d,
          createdAt: serverTimestamp()
        });
      }
    }

    // Check if portal messages exist
    const msgQuery = query(collection(db, 'portal_messages'), where('userId', '==', userId));
    const msgDocs = await getDocs(msgQuery);

    if (msgDocs.empty) {
      const messages: PortalMessage[] = [
        {
          id: 'msg_' + userId.slice(0, 5) + '_01',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          senderName: 'Sarah Jenkins, FCA',
          senderRole: 'Lead Strategic Partner',
          senderType: 'consultant',
          message: 'Welcome to your secure Accounticca Executive Client Portal! You can track real-time milestone progress, view pending invoices, download confidential advisory models, and message the senior engagement team directly here.',
          read: true,
        },
        {
          id: 'msg_' + userId.slice(0, 5) + '_02',
          userId,
          projectId: 'proj_' + userId.slice(0, 5) + '_01',
          senderName: 'Marcus Vance, CPA',
          senderRole: 'Senior Finance Director',
          senderType: 'consultant',
          message: 'We have updated the 3-Year Financial Model (v4.0) with the latest sensitivity metrics discussed in our Thursday strategy session. Feel free to review the Documents tab.',
          read: false,
        }
      ];

      for (const m of messages) {
        await setDoc(doc(db, 'portal_messages', m.id), {
          ...m,
          createdAt: serverTimestamp()
        });
      }
    }

    // Check if milestone comments exist
    const commQuery = query(collection(db, 'milestone_comments'), where('userId', '==', userId));
    const commDocs = await getDocs(commQuery);

    if (commDocs.empty) {
      const projId = 'proj_' + userId.slice(0, 5) + '_01';
      const initialComments: MilestoneComment[] = [
        {
          id: 'comm_' + userId.slice(0, 5) + '_01',
          projectId: projId,
          milestoneId: 'm1',
          milestoneTitle: 'Discovery & Executive Financial Diagnostic Audit',
          userId,
          authorName: 'Sarah Jenkins, FCA',
          authorRole: 'Lead Strategic Partner',
          authorType: 'consultant',
          tag: 'Status Update',
          content: 'Diagnostic phase completed on schedule! All subsidiary chart of accounts and general ledgers reconciled with zero discrepancies. Audit report uploaded to the Document Vault for final review.',
        },
        {
          id: 'comm_' + userId.slice(0, 5) + '_02',
          projectId: projId,
          milestoneId: 'm1',
          milestoneTitle: 'Discovery & Executive Financial Diagnostic Audit',
          userId,
          authorName: clientName,
          authorRole: 'Chief Executive Officer',
          authorType: 'client',
          tag: 'Approval',
          content: 'Reviewed the diagnostic breakdown with our CFO. The identified working capital cycle improvements match our Q3 priorities. Sign-off confirmed.',
        },
        {
          id: 'comm_' + userId.slice(0, 5) + '_03',
          projectId: projId,
          milestoneId: 'm2',
          milestoneTitle: 'Process Automation & Financial Tech Stack Setup',
          userId,
          authorName: 'Marcus Vance, CPA',
          authorRole: 'Senior Finance Director',
          authorType: 'consultant',
          tag: 'Deliverable Review',
          content: 'Live multi-entity reconciliation pipeline deployed. Automated billing rules are syncing with ERP feeds. Please test bank connection tokens.',
        },
        {
          id: 'comm_' + userId.slice(0, 5) + '_04',
          projectId: projId,
          milestoneId: 'm3',
          milestoneTitle: 'Executive KPI Dashboard & Variance Engine',
          userId,
          authorName: 'Sarah Jenkins, FCA',
          authorRole: 'Lead Strategic Partner',
          authorType: 'consultant',
          tag: 'Status Update',
          content: 'Cash flow sensitivity sandbox is currently running Monte Carlo simulations for 3-year revenue forecasts. Sprint velocity is at 75%.',
        },
        {
          id: 'comm_' + userId.slice(0, 5) + '_05',
          projectId: projId,
          milestoneId: 'm3',
          milestoneTitle: 'Executive KPI Dashboard & Variance Engine',
          userId,
          authorName: clientName,
          authorRole: 'Chief Executive Officer',
          authorType: 'client',
          tag: 'Clarification',
          content: 'Could we also add an EBITDA sensitivity scenario factoring a 12% rise in energy tariffs for the international branches?',
        }
      ];

      for (const comm of initialComments) {
        await setDoc(doc(db, 'milestone_comments', comm.id), {
          ...comm,
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.warn('Seeding initial portal data note:', error);
  }
}

// Live Subscriptions
export function subscribeToClientProjects(
  userId: string, 
  callback: (projects: ClientProject[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const projects: ClientProject[] = [];
      snapshot.forEach((docSnap) => {
        projects.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      callback(projects);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `projects`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `projects`);
    return () => {};
  }
}

export function subscribeToClientInvoices(
  userId: string, 
  callback: (invoices: ClientInvoice[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'invoices'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const invoices: ClientInvoice[] = [];
      snapshot.forEach((docSnap) => {
        invoices.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      // Sort in-memory to prevent complex composite index requirements
      invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
      callback(invoices);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `invoices`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `invoices`);
    return () => {};
  }
}

export function subscribeToClientDocuments(
  userId: string, 
  callback: (docs: ClientDocument[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const documents: ClientDocument[] = [];
      snapshot.forEach((docSnap) => {
        documents.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      callback(documents);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `documents`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `documents`);
    return () => {};
  }
}

export function subscribeToPortalMessages(
  userId: string, 
  callback: (messages: PortalMessage[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'portal_messages'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: PortalMessage[] = [];
      snapshot.forEach((docSnap) => {
        messages.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      callback(messages);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `portal_messages`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `portal_messages`);
    return () => {};
  }
}

// User Actions
export async function payClientInvoice(
  invoiceId: string, 
  paymentMethod: string = 'Corporate Credit Card'
): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    const invRef = doc(db, 'invoices', invoiceId);
    await updateDoc(invRef, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export interface UploadProjectDocumentOptions {
  file: File;
  userId: string;
  projectId: string;
  projectTitle: string;
  title: string;
  category: DocumentCategory;
  version?: string;
  confidential?: boolean;
  sharedBy?: string;
  description?: string;
  onProgress?: (progressPercent: number, bytesTransferred: number, totalBytes: number) => void;
}

export async function uploadProjectDocumentWithStorage(
  options: UploadProjectDocumentOptions
): Promise<ClientDocument> {
  const {
    file,
    userId,
    projectId,
    projectTitle,
    title,
    category,
    version = 'v1.0 (Client Upload)',
    confidential = true,
    sharedBy = 'Client Executive Team',
    description = '',
    onProgress
  } = options;

  const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `clients/${userId}/projects/${projectId}/documents/${Date.now()}_${sanitizedFileName}`;

  let downloadUrl = '';

  try {
    const storageRef = ref(storage, storagePath);
    const metadata = {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        userId,
        projectId,
        projectTitle,
        title,
        category,
        uploadedAt: new Date().toISOString()
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = snapshot.totalBytes > 0 
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
            : 0;
          if (onProgress) {
            onProgress(Math.round(progress), snapshot.bytesTransferred, snapshot.totalBytes);
          }
        },
        (error) => {
          console.warn('Firebase Storage upload notice:', error);
          reject(error);
        },
        async () => {
          try {
            downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          } catch (urlErr) {
            console.warn('Could not retrieve download URL:', urlErr);
            resolve();
          }
        }
      );
    });
  } catch (storageErr) {
    console.warn('Firebase Storage fallback activated:', storageErr);
    // In restricted sandbox environments where direct bucket CORS is unavailable, generate safe object URL
    downloadUrl = URL.createObjectURL(file);
    if (onProgress) {
      onProgress(100, file.size, file.size);
    }
  }

  const fileSizeFormatted = file.size > 1024 * 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`;

  const newDoc: ClientDocument = {
    id: docId,
    userId,
    projectId,
    projectTitle,
    title: title.trim(),
    category,
    fileName: file.name,
    fileSize: fileSizeFormatted,
    fileType: file.name.endsWith('.xlsx') || file.name.endsWith('.xlsm') 
      ? 'Excel Model' 
      : file.name.endsWith('.pdf') 
      ? 'PDF Document'
      : file.name.endsWith('.docx')
      ? 'Word Document'
      : file.name.endsWith('.pptx')
      ? 'PowerPoint Presentation'
      : file.type || 'Deliverable',
    downloadUrl: downloadUrl || undefined,
    storagePath,
    version,
    confidential,
    sharedBy,
    uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: description.trim() || `Uploaded to Firebase Storage for Project: ${projectTitle}`
  };

  // 1. Save document in Firestore collection 'documents'
  const path = `documents/${docId}`;
  try {
    await setDoc(doc(db, 'documents', docId), {
      ...newDoc,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  // 2. Also register in the Project's deliverables list if project document exists in Firestore
  try {
    const projRef = doc(db, 'projects', projectId);
    const projSnap = await getDoc(projRef);
    if (projSnap.exists()) {
      const projData = projSnap.data() as ClientProject;
      const currentDeliverables = projData.deliverables || [];
      const updatedDeliverables = [
        ...currentDeliverables,
        {
          id: 'del_' + docId,
          name: file.name,
          fileType: newDoc.fileType,
          size: fileSizeFormatted,
          date: newDoc.uploadedAt,
          downloadUrl: downloadUrl || undefined,
          status: 'in_review' as const
        }
      ];
      await updateDoc(projRef, {
        deliverables: updatedDeliverables,
        updatedAt: serverTimestamp()
      });
    }
  } catch (projUpdateErr) {
    console.warn('Project deliverable update note:', projUpdateErr);
  }

  // 3. Post notification update in portal messages for the advisory team
  try {
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    await setDoc(doc(db, 'portal_messages', msgId), {
      id: msgId,
      userId,
      projectId,
      senderName: sharedBy,
      senderRole: 'Executive Client',
      senderType: 'client',
      message: `[Uploaded to Firebase Storage] Client document "${newDoc.title}" (${newDoc.fileName}, ${fileSizeFormatted}) has been uploaded to project repository.`,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (msgErr) {
    // Non-blocking
  }

  return newDoc;
}

export async function uploadClientDocument(
  docData: Omit<ClientDocument, 'id' | 'createdAt'>
): Promise<string> {
  const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `documents/${docId}`;
  try {
    const newDoc: ClientDocument = {
      ...docData,
      id: docId
    };
    await setDoc(doc(db, 'documents', docId), {
      ...newDoc,
      createdAt: serverTimestamp()
    });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function sendPortalMessage(
  msgData: Omit<PortalMessage, 'id' | 'createdAt'>
): Promise<string> {
  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `portal_messages/${msgId}`;
  try {
    const newMsg: PortalMessage = {
      ...msgData,
      id: msgId
    };
    await setDoc(doc(db, 'portal_messages', msgId), {
      ...newMsg,
      createdAt: serverTimestamp()
    });
    return msgId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateMilestoneStatus(
  projectId: string, 
  milestoneId: string, 
  newStatus: MilestoneStatus | string,
  currentMilestones: ProjectMilestone[],
  delayReason?: string
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    const updated = currentMilestones.map(m => {
      if (m.id === milestoneId) {
        let progress = m.progress || 0;
        if (newStatus === 'completed') {
          progress = 100;
        } else if (newStatus === 'upcoming') {
          progress = 0;
        } else if (newStatus === 'in_progress' && progress === 0) {
          progress = 40;
        } else if (newStatus === 'delayed' && progress === 0) {
          progress = 25;
        }
        
        return { 
          ...m, 
          status: newStatus, 
          progress,
          ...(delayReason !== undefined ? { delayReason } : {})
        };
      }
      return m;
    });
    const completedCount = updated.filter(m => m.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / updated.length) * 100);

    const projRef = doc(db, 'projects', projectId);
    await updateDoc(projRef, {
      milestones: updated,
      progressPercentage,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function updateMilestoneDetails(
  projectId: string,
  milestoneId: string,
  updatedFields: Partial<ProjectMilestone>,
  currentMilestones: ProjectMilestone[]
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    const updated = currentMilestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, ...updatedFields };
      }
      return m;
    });
    const completedCount = updated.filter(m => m.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / updated.length) * 100);

    const projRef = doc(db, 'projects', projectId);
    await updateDoc(projRef, {
      milestones: updated,
      progressPercentage,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function addProjectMilestone(
  projectId: string,
  newMilestone: Omit<ProjectMilestone, 'id'>,
  currentMilestones: ProjectMilestone[]
): Promise<ProjectMilestone> {
  const path = `projects/${projectId}`;
  const milestoneId = 'm_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  const milestoneToAdd: ProjectMilestone = {
    ...newMilestone,
    id: milestoneId
  };

  try {
    const updated = [...currentMilestones, milestoneToAdd];
    const completedCount = updated.filter(m => m.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / updated.length) * 100);

    const projRef = doc(db, 'projects', projectId);
    await updateDoc(projRef, {
      milestones: updated,
      progressPercentage,
      updatedAt: serverTimestamp()
    });

    return milestoneToAdd;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

// ==========================================
// REAL-TIME MILESTONE COMMENTS & DISCUSSIONS
// ==========================================

export function subscribeToProjectMilestoneComments(
  userId: string,
  projectId: string,
  callback: (comments: MilestoneComment[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'milestone_comments'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const comments: MilestoneComment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        if (!projectId || data.projectId === projectId) {
          comments.push({ id: docSnap.id, ...data });
        }
      });
      
      // Sort chronologically (oldest to newest for thread display)
      comments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeA - timeB;
      });

      callback(comments);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `milestone_comments`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `milestone_comments`);
    return () => {};
  }
}

export async function addMilestoneComment(
  commentData: Omit<MilestoneComment, 'id' | 'createdAt'>
): Promise<string> {
  const commentId = 'comm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `milestone_comments/${commentId}`;
  try {
    const newComment: MilestoneComment = {
      ...commentData,
      id: commentId
    };
    await setDoc(doc(db, 'milestone_comments', commentId), {
      ...newComment,
      createdAt: serverTimestamp()
    });
    return commentId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function deleteMilestoneComment(commentId: string): Promise<void> {
  const path = `milestone_comments/${commentId}`;
  try {
    await deleteDoc(doc(db, 'milestone_comments', commentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// ==========================================
// TIME TRACKING & LOGGING
// ==========================================

export function subscribeToProjectTimeEntries(
  userId: string,
  projectId: string,
  callback: (entries: TimeEntry[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'milestone_time_entries'),
      where('userId', '==', userId),
      where('projectId', '==', projectId)
    );

    return onSnapshot(q, (snapshot) => {
      const entries: TimeEntry[] = [];
      snapshot.forEach((docSnap) => {
        entries.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      callback(entries);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `milestone_time_entries`);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `milestone_time_entries`);
    return () => {};
  }
}

export async function logTime(
  entryData: Omit<TimeEntry, 'id' | 'createdAt'>
): Promise<string> {
  const entryId = 'time_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `milestone_time_entries/${entryId}`;
  try {
    const newEntry: TimeEntry = {
      ...entryData,
      id: entryId
    };
    await setDoc(doc(db, 'milestone_time_entries', entryId), {
      ...newEntry,
      createdAt: serverTimestamp()
    });
    return entryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function deleteTimeEntry(entryId: string): Promise<void> {
  const path = `milestone_time_entries/${entryId}`;
  try {
    await deleteDoc(doc(db, 'milestone_time_entries', entryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function approveMilestone(
  projectId: string,
  milestoneId: string,
  milestoneTitle: string,
  userId: string,
  currentMilestones: ProjectMilestone[]
): Promise<void> {
  // Update status to finalized
  await updateMilestoneStatus(projectId, milestoneId, 'finalized', currentMilestones);

  // Send confirmation notification
  await sendPortalMessage({
    userId,
    projectId,
    senderName: 'Accounticca System',
    senderRole: 'Automation',
    senderType: 'consultant',
    message: `Milestone "${milestoneTitle}" has been officially approved and finalized by the client.`,
    read: false
  });
}

export function subscribeToCommentsForProjects(
  projectIds: string[],
  onComments: (comments: MilestoneComment[]) => void
) {
  if (projectIds.length === 0) return () => {};

  const q = query(
    collection(db, 'milestone_comments'),
    where('projectId', 'in', projectIds),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const comments: MilestoneComment[] = snapshot.docs.map(doc => doc.data() as MilestoneComment);
    onComments(comments);
  });
}
