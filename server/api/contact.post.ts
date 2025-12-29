export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { name, email, phone, subject, message, projectType, to } = body
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        message: 'Të gjitha fushat e kërkuara duhet të plotësohen'
      })
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Email i pavlefshëm'
      })
    }
    
    // Create email content
    const emailContent = `
Mesazh i ri nga Faqja e Kontaktit - Jehona Xhoxhaj Interior Design

═══════════════════════════════════════════════════

INFORMACIONI I KONTAKTIT:
────────────────────────────────────────────────────
Emri:           ${name}
Email:          ${email}
Telefon:        ${phone || 'Nuk është dhënë'}
Lloji Projektit: ${projectType ? getProjectTypeLabel(projectType) : 'Nuk është specifikuar'}

SUBJEKTI:
────────────────────────────────────────────────────
${subject}

MESAZHI:
────────────────────────────────────────────────────
${message}

═══════════════════════════════════════════════════

Dërguar nga: ${new Date().toLocaleString('sq-AL', { 
  timeZone: 'Europe/Tirane',
  dateStyle: 'full',
  timeStyle: 'short'
})}
    `.trim()
    
    // For development/demo purposes, log the email content
    // In production, you would send this via an email service
    console.log('📧 Email to be sent to:', to)
    console.log('📝 Email content:')
    console.log(emailContent)
    
    // Here you would integrate with an email service like:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - Nodemailer with SMTP
    // - AWS SES
    
    // Example with Resend (you need to install: npm install resend)
    /*
    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'kontakt@yourdomain.com',
      to: to,
      subject: `Mesazh i ri nga ${name}: ${subject}`,
      text: emailContent,
      replyTo: email
    })
    */
    
    // For now, simulate successful email sending
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      message: 'Mesazhi u dërgua me sukses!'
    }
    
  } catch (error: any) {
    console.error('Error in contact API:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ndodhi një gabim gjatë dërgimit të mesazhit'
    })
  }
})

// Helper function to get project type label
function getProjectTypeLabel(value: string): string {
  const types: Record<string, string> = {
    'bedroom': 'Dhomë Gjumi',
    'kitchen': 'Kuzhinë',
    'living-room': 'Dhomë Ndenjeje',
    'children-room': 'Dhomë Fëmijësh',
    'office': 'Zyrë',
    'commercial': 'Dyqan/Biznes',
    'furniture': 'Mobilje të Personalizuara',
    'other': 'Tjetër'
  }
  return types[value] || value
}
