import pravaCircle from "@/public/images/prava-circle.png";
import pravaHome from "@/public/images/prava-home.png";
import pravaJournal from "@/public/images/prava-journal.png";
import pravaLectio from "@/public/images/prava-lectio.png";

/** The four Prava screens, shown on the home page and on Prava's page. */
export const PRAVA_SCREENS = [
  {
    src: pravaHome,
    alt: "Prava's home screen for the 17th Sunday in Ordinary Time: a verse card from Romans 8, this week's readings with completed checkmarks, and the Prayers and Creeds row.",
    caption: "The week is the spine. No streak anywhere.",
  },
  {
    src: pravaLectio,
    alt: "The Pray movement of Lectio Divina: Romans 8:28-30 with a phrase highlighted, a text field labeled In your own words, and a Help me pray this button.",
    caption: "One verse, slowly. Prayer in your own words.",
  },
  {
    src: pravaJournal,
    alt: "The daily journal asking How was yesterday, with Light, Normal, and Heavy load options and yes or no questions including Pray, Read your Bible, and Confess something to God.",
    caption: "The daily journal. Yes and no, nothing pre-filled.",
  },
  {
    src: pravaCircle,
    alt: "A Circle group screen: nine members reading Romans, this week's verse, and a feed of marks such as a member praying the Examen.",
    caption: "A few people keeping the same week.",
  },
];
