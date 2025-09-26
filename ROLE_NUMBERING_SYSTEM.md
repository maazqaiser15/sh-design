# Role Numbering System - For Easy Communication

## 🎯 **Simplified Role Reference**

| Role Number | Role Name | Access Level | Key Features |
|-------------|-----------|--------------|--------------|
| **Role 1** | Executive | Full System Access | All modules, all permissions |
| **Role 2** | Project Coordinator | Management Access | Project management, team coordination |
| **Role 3** | Execution Team | Operational Access | Task execution, restricted project visibility |

---

## 🔐 **Role 1 - Executive**
- **Email Patterns**: `admin@`, `vp@`, `ceo@`, `director@`, `cfo@`, `cto@`
- **Permissions**: All modules with view/edit/manage access
- **Project Visibility**: All project statuses (PV75, PV90, UB, WB, WIP, QF, Completed)
- **Demo Account**: `admin@safehavendefense.com`

## 🔵 **Role 2 - Project Coordinator**
- **Email Patterns**: `pm@`, `coordinator@`, `manager@`, `supervisor@`, `lead@`
- **Permissions**: Projects (full), Team/Trailers/Scheduler/Documents (edit), Reports (view)
- **Project Visibility**: All project statuses (PV75, PV90, UB, WB, WIP, QF, Completed)
- **Demo Account**: `pm@safehavendefense.com`

## 🟢 **Role 3 - Execution Team**
- **Email Patterns**: `crew@`, `team@`, `field@`, `ground@`, `ops@`, `logistics@`, `production@`, `quality@`, `safety@`, `finance@`, `hr@`, `it@`
- **Permissions**: All modules (view only), no edit/manage capabilities
- **Project Visibility**: **RESTRICTED** - Only WIP, QF, Completed (no PV75, PV90, UB, WB)
- **Module Access**: No Teams module, No Trailers module
- **Demo Account**: `crew@safehavendefense.com`

---

## 📊 **Quick Reference Table**

| Feature | Role 1 (Executive) | Role 2 (Project Coordinator) | Role 3 (Execution Team) |
|---------|-------------------|------------------------------|-------------------------|
| **Dashboard** | ✅ All | ✅ View | ✅ View |
| **Projects** | ✅ All | ✅ All | ✅ View (filtered) |
| **Team** | ✅ All | ✅ Edit | ❌ No Access |
| **Trailers** | ✅ All | ✅ Edit | ❌ No Access |
| **Scheduler** | ✅ All | ✅ Edit | ✅ View |
| **Documents** | ✅ All | ✅ Edit | ✅ View |
| **Settings** | ✅ All | ✅ View | ❌ None |
| **Reports** | ✅ All | ✅ View | ❌ None |
| **Analytics** | ✅ All | ❌ None | ❌ None |

---

## 🧪 **Test Accounts by Role**

### **Role 1 (Executive)**
```
admin@safehavendefense.com
vp@safehavendefense.com
ceo@safehavendefense.com
```

### **Role 2 (Project Coordinator)**
```
pm@safehavendefense.com
coordinator@safehavendefense.com
manager@safehavendefense.com
```

### **Role 3 (Execution Team)**
```
crew@safehavendefense.com
ops@safehavendefense.com
logistics@safehavendefense.com
production@safehavendefense.com
```

---

## ✅ **Current Implementation Status**

- ✅ **Role 1**: Full system access implemented
- ✅ **Role 2**: Project management access implemented  
- ✅ **Role 3**: Restricted access implemented
  - ❌ No Teams module access
  - ❌ No Trailers module access
  - ❌ No PV75, PV90, UB, WB project visibility
  - ✅ Only WIP, QF, Completed projects visible

This numbering system will make our communication much clearer! 🚀
