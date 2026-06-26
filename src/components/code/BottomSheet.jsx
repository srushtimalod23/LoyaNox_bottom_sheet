import { useState, useRef, useEffect, useCallback } from "react";
import { GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const dummyParagraphs = [
  "Create a bottom sheet modal that functions similarly to Facebook modal using HTML CSS and JavaScript. This modal allows user to view its contents, drag it up or down, and close it. It also works on touch-enabled devices. Lorem Ipsum are simply dummy text of there printing and typesetting industry. Lorem new Ipsum has been the industryss standard dummy text ever since the 1500s, when an off unknown printer tooks a galley of type and scrambled it to makes type spemen book It has survived not only five centuries.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quae facere, quaerat deleniti, voluptates optio ipsam ipsum beatae, maxime quis ea quasi minima numquam. Minima accusamus reiciendis, impedit blanditiis nulla quia? Odio deleniti commodi id nesciunt voluptas cumque odit, vel molestias ratione sit consectetur inventore error ullam magni labore voluptate doloribus sed similique. Delectus non pariatur eligendi eos voluptatum provident eveniet consequuntur. Laboriosam, nesciunt reiciendis libero sunt adipisci numquam voluptas ullam.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum eligendi commodi tenetur est beatae cupiditate incidunt aspernatur asperiores repudiandae? Odit, nulla modi ducimus assumenda ad voluptatem explicabo laudantium est unde ea similique excepturi fugiat nisi facere ab pariatur libero eius aperiam, non accusantium, asperiores optio.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates, animi ipsa explicabo assumenda molestiae adipisci. Amet, dignissimos reiciendis, voluptatibus placeat quo ab quibusdam illum repellat, ad molestias quaerat saepe modi aperiam distinctio dolore id sapiente molestiae quas!",
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt deleniti a non dolorem delectus possimus distinctio! Nemo officiis tempore quos culpa fugit iste suscipit minus voluptatem, officia dicta ad deleniti harum voluptatibus dignissimos in, commodi placeat accusamus sint tenetur non natus.",
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat atque labore eligendi iusto sint! Fuga vel eius dolor eligendi ab cumque, maxime commodi, ducimus inventore temporibus illo delectus iste, quisquam ipsum labore eaque ipsa soluta praesentium voluptatem accusamus amet recusandae.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione, molestias obcaecati officiis consectetur deleniti iste, rerum quis nihil animi laborum doloremque voluptate maiores facere pariatur aperiam veritatis ipsum sed.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur enim maiores magnam illo cupiditate dolores repellendus delectus impedit suscipit sapiente laboriosam architecto, natus asperiores officia dignissimos necessitatibus ea eveniet possimus.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis saepe quidem doloremque reiciendis provident eaque beatae suscipit molestiae rerum, quia velit numquam eos, placeat ducimus amet ipsa quos exercitationem aliquid."
];

function BottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(50);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(50);

  // Show Bottom Sheet
  const showBottomSheet = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    setHeight(50);
  }, []);

  // Hide Bottom Sheet
  const hideBottomSheet = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  // Start Drag
  const dragStart = useCallback((e) => {
    isDragging.current = true;
    startY.current = e.pageY || e.touches?.[0]?.pageY;
    startHeight.current = height;
  }, [height]);

  // Dragging
  const dragging = useCallback((e) => {
    if (!isDragging.current) return;

    const currentY = e.pageY || e.touches?.[0]?.pageY;
    const delta = startY.current - currentY;
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100;

    setHeight(Math.max(0, Math.min(100, newHeight)));
  }, []);

  // Stop Drag
  const dragStop = useCallback(() => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (height < 25) {
      hideBottomSheet();
    } else if (height > 75) {
      setHeight(100);
    } else {
      setHeight(50);
    }
  }, [height, hideBottomSheet]);

  // Global Events
  useEffect(() => {
    const events = [
      { type: "mousemove", handler: dragging },
      { type: "mouseup", handler: dragStop },
      { type: "touchmove", handler: dragging },
      { type: "touchend", handler: dragStop },
    ];

    events.forEach(({ type, handler }) =>
      document.addEventListener(type, handler)
    );

    return () => {
      events.forEach(({ type, handler }) =>
        document.removeEventListener(type, handler)
      );
    };
  }, [dragging, dragStop]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-100">
      {/* Open Button */}
      <Button onClick={showBottomSheet} size="lg" className="shadow-lg">
        Show Bottom Sheet
      </Button>

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={hideBottomSheet}
          className="absolute inset-0 bg-black/20"
        />

        {/* Content */}
        <div
          style={{ height: `${height}vh` }}
          className={`relative mx-auto w-full max-w-6xl bg-white shadow-xl transition-all duration-300 ${
            height === 100 ? "rounded-none" : "rounded-t-2xl"
          }`}
        >
          {/* Header */}
          <div className="flex justify-center border-b">
            <div
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              className="cursor-grab p-3 active:cursor-grabbing"
            >
              <GripHorizontal size={35} className="text-slate-400" />
            </div>
          </div>

          {/* Body */}
          <div className="h-[calc(100%-60px)] overflow-y-auto px-8 pb-10 pt-5">
            <h2 className="text-3xl font-bold">Bottom Sheet Modal</h2>

            {dummyParagraphs.map((text, index) => (
              <p key={index} className="mt-5 leading-8 text-gray-600">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;