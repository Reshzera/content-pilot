FROM postgres:latest


ENV POSTGRES_DB=music-pay
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin


EXPOSE 5432


VOLUME [ "/var/lib/postgresql/data" ]


CMD ["postgres"]
