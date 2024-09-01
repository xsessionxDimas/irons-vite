import { useRouter } from "vue-router";

export default function () {
  const router = useRouter();

  const redirectByLink = (link: string) => {
    if (link.substring(1) == "/shetech/outbreak-management/contact-tracing") {
      return router.replace({
        path: link,
        query: { v: 1 },
      });
    } else {
      return router.push({ path: link });
    }
  };

  const redirectByName = (name: string) => {
    return router.push({ name: name });
  };

  const redirectByNameWithId = (name: string, id: number) => {
    router.push({
      name: name,
      query: {
        id: id,
      },
    });
  };

  return {
    redirectByLink,
    redirectByName,
    redirectByNameWithId,
  };
}
