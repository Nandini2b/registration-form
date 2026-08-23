const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.getElementById("progressFill");
const subjectSection = document.getElementById("subjectSection");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const formContent = document.querySelector(".form-content");
const successPanel = document.getElementById("successPanel");
const registerNewStudent = document.getElementById("registerNewStudent");

const scienceSubjects = [
    "B.Sc. Chemistry", "B.Sc. Biochemistry", "B.Sc. Biotechnology",
    "B.Sc. Botany", "B.Sc. Zoology", "B.Sc. Physics",
    "B.Sc. Mathematics", "B.Sc. Electronics", "B.Sc. Computer Science"
];

const artsSubjects = [
    "B.A. English Literature", "B.A. Hindi Literature", "B.A. Economics",
    "B.A. History", "B.A. Philosophy", "B.A. Political Science",
    "B.A. Physiology", "B.A. Sociology"
];

const stream = document.getElementById("stream");
const dsc1 = document.getElementById("dsc1");
const dsc2 = document.getElementById("dsc2");
const dsc3 = document.getElementById("dsc3");
const photo = document.getElementById("photo");
const fileUpload = document.getElementById("fileUpload");
const fileUploadLabel = document.getElementById("fileUploadLabel");
const photoPreview = document.getElementById("photoPreview");
const previewImage = document.getElementById("previewImage");
const removePhoto = document.getElementById("removePhoto");
const changePhoto = document.getElementById("changePhoto");

const requiredFields = [
    { id: "name", validator: v => v.trim().length >= 2, message: "Name must be at least 2 characters" },
    { id: "email", validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Enter a valid email address" },
    { id: "mobile", validator: v => /^[6-9]\d{9}$/.test(v), message: "Enter a valid 10-digit mobile number" },
    { id: "apaar", validator: v => v.trim().length > 0, message: "APAAR ID is required" },
    { id: "dob", validator: v => { if (!v) return false; const age = new Date().getFullYear() - new Date(v).getFullYear(); return age >= 14; }, message: "Must be at least 14 years old" },
    { id: "aadhaar", validator: v => /^\d{12}$/.test(v), message: "Enter a valid 12-digit Aadhaar number" },
    { id: "stream", validator: v => v !== "", message: "Please select a stream" },
    { id: "nomineeName", validator: v => v.trim().length >= 2, message: "Nominee name is required" },
    { id: "nomineeDob", validator: v => v !== "", message: "Nominee date of birth is required" },
    { id: "nomineeMobile", validator: v => /^[6-9]\d{9}$/.test(v), message: "Enter a valid 10-digit mobile number" },
    { id: "nomineeAadhaar", validator: v => /^\d{12}$/.test(v), message: "Enter a valid 12-digit Aadhaar number" }
];

function showToast(message, type = "info") {
    toastMessage.textContent = message;
    toast.className = `toast ${type} visible`;
    toast.setAttribute("aria-hidden", "false");
    setTimeout(() => {
        toast.classList.remove("visible");
        toast.setAttribute("aria-hidden", "true");
    }, 4000);
}

function updateProgress() {
    const allInputs = form.querySelectorAll("input[required], select[required]");
    let filled = 0;
    allInputs.forEach(input => {
        if (input.type === "file") {
            if (input.files.length > 0) filled++;
        } else if (input.value.trim() !== "") {
            filled++;
        }
    });
    const percentage = Math.round((filled / allInputs.length) * 100);
    progressFill.style.width = `${percentage}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", percentage);
}

function validateField(field) {
    const wrapper = document.getElementById(`${field.id}Wrapper`);
    const errorEl = document.getElementById(`${field.id}Error`);
    const validation = requiredFields.find(f => f.id === field.id);

    if (!validation) return true;

    const isValid = validation.validator(field.value);

    field.classList.remove("valid", "invalid", "error");
    wrapper?.classList.remove("focused");

    if (field.value.trim() === "") {
        field.classList.remove("valid", "invalid");
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
        return false;
    }

    if (isValid) {
        field.classList.add("valid");
        field.classList.remove("invalid");
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
        return true;
    } else {
        field.classList.add("invalid", "error");
        field.classList.remove("valid");
        errorEl.textContent = validation.message;
        errorEl.classList.add("visible");
        setTimeout(() => field.classList.remove("error"), 400);
        return false;
    }
}

function validateDSCFields() {
    if (!subjectSection.classList.contains("visible")) return true;

    let allValid = true;
    [dsc1, dsc2, dsc3].forEach(select => {
        const isValid = validateField(select);
        if (!isValid) allValid = false;
    });

    const values = [dsc1.value, dsc2.value, dsc3.value].filter(v => v);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
        [dsc1, dsc2, dsc3].forEach(select => {
            if (values.indexOf(select.value) !== values.lastIndexOf(select.value)) {
                const wrapper = document.getElementById(`${select.id}Wrapper`);
                const errorEl = document.getElementById(`${select.id}Error`);
                select.classList.add("invalid", "error");
                select.classList.remove("valid");
                errorEl.textContent = "Each subject must be unique";
                errorEl.classList.add("visible");
                setTimeout(() => select.classList.remove("error"), 400);
                allValid = false;
            }
        });
    }

    return allValid;
}

function checkFormValidity() {
    let allValid = true;
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input && !validateField(input)) allValid = false;
    });
    if (!validateDSCFields()) allValid = false;

    const photoValid = photo.files.length > 0;
    const photoWrapper = document.getElementById("photoWrapper");
    const photoError = document.getElementById("photoError");
    if (!photoValid) {
        photoWrapper?.classList.add("focused");
        photoError.textContent = "Please upload a photo";
        photoError.classList.add("visible");
        allValid = false;
    } else {
        photoError.textContent = "";
        photoError.classList.remove("visible");
    }

    submitBtn.disabled = !allValid;
    return allValid;
}

function addDefaultOption(select, text) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = text;
    select.appendChild(option);
}

function addOption(select, subject) {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    select.appendChild(option);
}

function loadSubjects(subjects) {
    [dsc1, dsc2, dsc3].forEach(select => {
        select.innerHTML = "";
        addDefaultOption(select, `-- Select ${select.id.toUpperCase()} --`);
    });

    subjects.forEach(subject => {
        addOption(dsc1, subject);
        addOption(dsc2, subject);
        addOption(dsc3, subject);
    });
}

function updateSubjects() {
    const selected1 = dsc1.value;
    const selected2 = dsc2.value;
    const selected3 = dsc3.value;

    const subjects = stream.value === "Arts" ? artsSubjects : scienceSubjects;

    [dsc1, dsc2, dsc3].forEach(select => {
        const currentValue = select.value;
        const others = [dsc1, dsc2, dsc3].filter(s => s !== select).map(s => s.value);

        select.innerHTML = "";
        addDefaultOption(select, `-- Select ${select.id.toUpperCase()} --`);

        subjects.forEach(subject => {
            if (!others.includes(subject)) {
                addOption(select, subject);
            }
        });

        select.value = currentValue;
    });

    validateDSCFields();
    checkFormValidity();
}

function clearSubjects() {
    [dsc1, dsc2, dsc3].forEach(select => select.innerHTML = "");
}

stream.addEventListener("change", function () {
    clearSubjects();
    if (stream.value === "Science" || stream.value === "Arts") {
        subjectSection.classList.add("visible");
        subjectSection.setAttribute("aria-hidden", "false");
        loadSubjects(stream.value === "Arts" ? artsSubjects : scienceSubjects);
    } else {
        subjectSection.classList.remove("visible");
        subjectSection.setAttribute("aria-hidden", "true");
    }
    checkFormValidity();
    updateProgress();
});

[dsc1, dsc2, dsc3].forEach(select => {
    select.addEventListener("change", updateSubjects);
});

function convertPhotoToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read photo"));
        reader.readAsDataURL(file);
    });
}

photo.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showToast("Please select an image file", "error");
            this.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast("File size must be less than 5MB", "error");
            this.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            previewImage.src = e.target.result;
            photoPreview.classList.add("visible");
            fileUploadLabel.style.display = "none";
        };
        reader.readAsDataURL(file);
        checkFormValidity();
        updateProgress();
    }
});

removePhoto.addEventListener("click", () => {
    photo.value = "";
    photoPreview.classList.remove("visible");
    fileUploadLabel.style.display = "flex";
    checkFormValidity();
    updateProgress();
});

changePhoto.addEventListener("click", () => photo.click());

fileUpload.addEventListener("dragover", e => {
    e.preventDefault();
    fileUpload.classList.add("drag-over");
});

fileUpload.addEventListener("dragleave", e => {
    e.preventDefault();
    fileUpload.classList.remove("drag-over");
});

fileUpload.addEventListener("drop", e => {
    e.preventDefault();
    fileUpload.classList.remove("drag-over");
    if (e.dataTransfer.files.length) {
        photo.files = e.dataTransfer.files;
        photo.dispatchEvent(new Event("change"));
    }
});

form.querySelectorAll("input, select").forEach(input => {
    const wrapper = document.getElementById(`${input.id}Wrapper`);
    input.addEventListener("focus", () => wrapper?.classList.add("focused"));
    input.addEventListener("blur", () => {
        wrapper?.classList.remove("focused");
        validateField(input);
        validateDSCFields();
        checkFormValidity();
        updateProgress();
    });
    input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
            validateField(input);
            checkFormValidity();
        }
        updateProgress();
    });
    input.addEventListener("change", () => {
        validateField(input);
        validateDSCFields();
        checkFormValidity();
        updateProgress();
    });
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!checkFormValidity()) {
        const firstInvalid = form.querySelector(".invalid, .error");
        firstInvalid?.focus();
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Please fix the errors above", "error");
        return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const photoFile = photo.files[0];
        const photoBase64 = await convertPhotoToBase64(photoFile);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            mobile: formData.get("mobile"),
            apaar: formData.get("apaar"),
            dob: formData.get("dob"),
            aadhaar: formData.get("aadhaar"),
            stream: formData.get("stream"),
            dsc1: formData.get("dsc1"),
            dsc2: formData.get("dsc2"),
            dsc3: formData.get("dsc3"),
            nomineeName: formData.get("nomineeName"),
            nomineeDob: formData.get("nomineeDob"),
            nomineeMobile: formData.get("nomineeMobile"),
            nomineeAadhaar: formData.get("nomineeAadhaar"),
            photoName: photoFile.name,
            photoType: photoFile.type,
            photoBase64: photoBase64
        };

        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Registration proxy request failed");

        showToast("Registration submitted successfully!", "success");

        form.reset();
        subjectSection.classList.remove("visible");
        subjectSection.setAttribute("aria-hidden", "true");
        photoPreview.classList.remove("visible");
        fileUploadLabel.style.display = "flex";
        clearSubjects();
        progressFill.style.width = "0%";
        progressFill.parentElement.setAttribute("aria-valuenow", "0");

        formContent.classList.add("hidden");
        successPanel.classList.add("visible");
        successPanel.setAttribute("aria-hidden", "false");
        registerNewStudent.focus();

        form.querySelectorAll("input, select").forEach(input => {
            input.classList.remove("valid", "invalid");
        });

    } catch (error) {
        console.error("Submission error:", error);
        showToast("There was a problem submitting the form. Please try again.", "error");
    } finally {
        submitBtn.classList.remove("loading");
        checkFormValidity();
    }
});

registerNewStudent.addEventListener("click", () => {
    successPanel.classList.remove("visible");
    successPanel.setAttribute("aria-hidden", "true");
    formContent.classList.remove("hidden");
    form.reset();
    subjectSection.classList.remove("visible");
    subjectSection.setAttribute("aria-hidden", "true");
    photoPreview.classList.remove("visible");
    fileUploadLabel.style.display = "flex";
    clearSubjects();
    progressFill.style.width = "0%";
    progressFill.parentElement.setAttribute("aria-valuenow", "0");
    form.querySelectorAll("input, select").forEach(input => input.classList.remove("valid", "invalid", "error"));
    formContent.scrollIntoView({ behavior: "smooth", block: "start" });
    checkFormValidity();
});

async function init() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 14);
    document.getElementById("dob").max = maxDate.toISOString().split("T")[0];
    document.getElementById("nomineeDob").max = new Date().toISOString().split("T")[0];

    form.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", updateProgress);
        input.addEventListener("change", updateProgress);
    });

    updateProgress();
    checkFormValidity();
}

document.addEventListener("DOMContentLoaded", init);
