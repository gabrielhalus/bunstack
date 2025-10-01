import { Link, useMatches } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@bunstack/ui/components/breadcrumb";

export function Breadcrumbs() {
  const { t } = useTranslation("app");
  const matches = useMatches();

  const items = matches
    .filter(match => match.loaderData?.crumb)
    .map(({ loaderData, ...match }) => ({
      ...match,
      label: loaderData?.crumb,
    }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                {isLast
                  ? (
                      <BreadcrumbPage className="line-clamp-1">
                        {t(item.label as string)}
                      </BreadcrumbPage>
                    )
                  : (
                      <Link to={item.pathname} params={item.params} className="line-clamp-1 hover:underline">
                        {t(item.label as string)}
                      </Link>
                    )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
