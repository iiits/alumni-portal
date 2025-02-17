"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <div className="mt-12 w-full p-4 px-64">
      <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">
            What is the IIITS Alumni Portal?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            The IIITS Alumni Portal is a platform where alumni and students can
            connect, share experiences, and access exclusive resources.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg">
            Who can register on the alumni portal?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Current students, alumni, and faculty members of IIITS can register
            on the portal.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg">
            How do I verify my email after signing up?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            After signing up, you will receive a verification email. Click on
            the link in the email to verify your account and gain full access to
            the portal.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg">
            What features does the portal offer?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            The portal offers networking, job postings, event updates,
            mentorship programs, and forums for alumni and students to engage in
            discussions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg">
            How can I update my profile information?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            After logging in, go to your profile section where you can edit
            details like your bio, batch, department, and contact information.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-lg">
            Is my data secure?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Yes, we take privacy seriously. Your data is protected and will not
            be shared with third parties without your consent.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="text-lg">
            Can I connect with other alumni?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Yes! The portal allows you to search for alumni, send connection
            requests, and interact through messaging and forums.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger className="text-lg">
            Are there any events or reunions?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Yes, the portal provides updates on upcoming alumni meetups,
            reunions, and other events organized by IIITS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger className="text-lg">
            How do I post job opportunities?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            If you are an alumnus or recruiter, you can post job opportunities
            in the job section of the portal to help students and fellow alumni.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger className="text-lg">
            Whom should I contact for support?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            If you face any issues, you can reach out to our support team via
            the
            <strong> &quot;Contact Us&quot; </strong> section on the portal.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
